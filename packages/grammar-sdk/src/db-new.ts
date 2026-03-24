import { eq, inArray, sql } from "drizzle-orm";
import { db, type Transaction } from "../../../libs/db";
import {
  GrammarPoints,
  type CreateGrammarPoint,
  type GrammarPoint,
  type UpdateGrammarPoint,
} from "./grammar-point";
import {
  exercisePartsTmp,
  exercisesTmp,
  grammarPointsTmp,
} from "../../../libs/db/schema-tmp";
import { GrammarPointDb, GrammarPointsDb } from "./grammar-point/dto";
import { err, ok, type Result } from "neverthrow";
import { Context } from "./context";
import { type Exercise, Exercises } from "./exercise";
import { ExerciseDb, type PartToCreateDb } from "./exercise/dto";

export const getGrammarPoint = async (
  id: number,
): Promise<GrammarPoint | undefined> => {
  const grammarDto = await db.query.grammarPointsTmp.findFirst({
    where: eq(grammarPointsTmp.id, id),
    with: {
      exercises: {
        with: {
          parts: {
            with: {
              acceptableAnswers: true,
            },
          },
        },
      },
    },
  });

  return grammarDto && GrammarPointDb.toGrammarPoint(grammarDto);
};

export const getGrammarPoints = async (
  ids?: number[],
): Promise<GrammarPoint[]> => {
  const grammarDto = await db.query.grammarPointsTmp.findMany({
    where: ids ? inArray(grammarPointsTmp.id, ids) : undefined,
    with: {
      exercises: {
        with: {
          parts: {
            with: {
              acceptableAnswers: true,
            },
          },
        },
      },
    },
  });

  return GrammarPointsDb.toGrammarPoints(grammarDto);
};

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export const isAuthorizationError = (
  error: unknown,
): error is AuthorizationError => {
  return error instanceof Error && error.name === "AuthorizationError";
};

/**
 *
 * @param data Grammar point without exercises and examples. Currently always hidden
 */
export const createGrammarPoint = async (
  data: CreateGrammarPoint,
  context: Context,
): Promise<Result<number, string | AuthorizationError>> => {
  if (!Context.isAdmin(context)) {
    return err(
      new AuthorizationError(
        "Currently users without admin rights cannot create grammar points.",
      ),
    );
  }
  const grammarPoints = await getGrammarPoints();
  const violates = GrammarPoints.checkViolation(grammarPoints, data);
  if (violates.isErr()) {
    return err(violates.error);
  }
  const maxOrder = GrammarPoints.maxOrder(grammarPoints);

  const created = await db
    .insert(grammarPointsTmp)
    .values({
      ...data,
      hide: true,
      order: maxOrder + 1,
    })
    .returning();

  return created?.[0]?.id
    ? ok(created[0].id)
    : err("Unexpected error occurred while creating grammar point.");
};

export const updateGrammarPoint = async (
  update: UpdateGrammarPoint,
  context: Context,
): Promise<Result<true, string | AuthorizationError>> => {
  if (!Context.isAdmin(context)) {
    return err(
      new AuthorizationError(
        "Currently users without admin rights cannot update grammar points.",
      ),
    );
  }

  const grammarPoints = await getGrammarPoints();
  const violates = GrammarPoints.checkViolation(grammarPoints, update);
  if (violates.isErr()) {
    return err(violates.error);
  }

  const { id, ...updateData } = update;

  await db
    .update(grammarPointsTmp)
    .set(updateData)
    .where(eq(grammarPointsTmp.id, +id));

  return ok(true);
};

export const updateGrammarPointsOrder = async (
  newOrder: { id: string; order: number }[],
  context: Context,
): Promise<Result<true, string | AuthorizationError>> => {
  if (!Context.isAdmin(context)) {
    return err(
      new AuthorizationError(
        "Currently users without admin rights cannot update grammar points.",
      ),
    );
  }

  const grammarPoints = await getGrammarPoints();
  const valid = GrammarPoints.validateNewOrder(grammarPoints, newOrder);
  if (valid.isErr()) {
    return valid;
  }

  const sqlUpdate = sql`
          UPDATE ${grammarPointsTmp} o
          SET "order" = v.new_order
          FROM (
            VALUES
              ${sql.join(
                newOrder.map((o) => sql`(${o.id}::int, ${o.order}::int)`),
                sql`, `,
              )}
          ) AS v(id, new_order)
          WHERE o.id = v.id
        `;
  await db.execute(sqlUpdate);

  return ok(true);
};

const createExercises = async (
  tx: Transaction,
  creating: Exercise[],
): Promise<Result<true, string>> => {
  if (!creating.length) {
    return ok(true);
  }
  const grammarPointId = creating[0].grammarPointId;
  if (!grammarPointId) {
    return err("Grammar point ID is required to create exercises.");
  }

  const exercisesToCreate = creating.map(ExerciseDb.fromExerciseToCreate);

  for (const exercise of exercisesToCreate) {
    const insertedExercise = await tx
      .insert(exercisesTmp)
      .values({ ...exercise })
      .returning();

    await createParts(tx, insertedExercise[0].id, exercise.parts);
  }
  return ok(true);
};

// Drizzle doesn't support nested inserts with 2+ nesting levels.
const createParts = async (
  tx: Transaction,
  exerciseId: number,
  partsToCreate: PartToCreateDb[],
) => {
  return await tx
    .insert(exercisePartsTmp)
    .values(
      partsToCreate.map((part) => ({
        exerciseId,
        ...part,
      })),
    )
    .returning();
};

const updateExercises = async (
  tx: Transaction,
  updating: (Exercise & { id: number })[],
): Promise<Result<true, string>> => {
  const updatingExercises = updating.map(ExerciseDb.fromExerciseToUpdate);
  for (const exercise of updatingExercises) {
    await tx
      .update(exercisesTmp)
      .set({
        order: exercise.order,
        hide: exercise.hide,
      })
      .where(eq(exercisesTmp.id, exercise.id));

    await tx
      .delete(exercisePartsTmp)
      .where(eq(exercisePartsTmp.exerciseId, exercise.id))
      .execute();

    await createParts(tx, exercise.id, exercise.parts);
  }
  return ok(true);
};

export const putExercises = async (
  exercises: Exercise[],
  context: Context,
): Promise<Result<true, string | AuthorizationError>> => {
  if (!Context.isAdmin(context)) {
    return err(
      new AuthorizationError(
        "Currently users without admin rights cannot create exercises.",
      ),
    );
  }

  const grammarPointId = exercises[0]?.grammarPointId;
  if (!grammarPointId) {
    return err("Grammar point ID is required to create exercises.");
  }

  const existingExercises = await getGrammarPoint(+grammarPointId).then(
    (gp) => gp?.exercises,
  );
  if (!existingExercises) {
    return err(
      `Grammar point ${grammarPointId} should exist before creating exercises. Please create the grammar point first.`,
    );
  }

  const validation = Exercises.validate(exercises);
  if (validation.isErr()) {
    return validation;
  }

  const { toCreate, toUpdate } = Exercises.splitToCreateAndUpdate(
    exercises,
    existingExercises,
  );

  return await db.transaction(async (tx) => {
    const result = await createExercises(tx, toCreate);
    if (result.isErr()) return result;
    return await updateExercises(tx, toUpdate);
  });
};
