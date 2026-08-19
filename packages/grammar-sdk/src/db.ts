import { eq, inArray, sql } from "drizzle-orm";
import { db, type DbClient, type Transaction } from "db";
import {
  GrammarPoints,
  type CreateGrammarPoint,
  type GrammarPoint,
  type UpdateGrammarPoint,
} from "./grammar-point";
import {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
  grammarPointsTmp,
  labels,
  labelsToGrammarPoints,
} from "db/schema-tmp";
import { GrammarPointDb, GrammarPointsDb } from "./grammar-point/dto";
import { err, ok, okAsync, ResultAsync, type Result } from "neverthrow";
import { Context } from "auth";
import { type Exercise, Exercises } from "./exercise";
import { ExerciseDb, ExercisesDb, type PartToCreateDb } from "./exercise/dto";
import {
  LabelDb,
  LabelsDb,
  type CreateLabel,
  type Label,
  type UpdateLabel,
} from "./label";

export const getGrammarPoint = async (
  id: number,
  dbClient: DbClient = db,
): Promise<GrammarPoint | undefined> => {
  const grammarDto = await dbClient.query.grammarPointsTmp.findFirst({
    where: eq(grammarPointsTmp.id, id),
    with: {
      labelsToGrammarPoints: { with: { label: true } },
    },
  });

  return grammarDto && GrammarPointDb.toGrammarPoint(grammarDto);
};

export const getGrammarPoints = async (
  ids?: number[],
  dbClient: DbClient = db,
): Promise<GrammarPoint[]> => {
  const mainQuery = {
    where: ids ? inArray(grammarPointsTmp.id, ids) : undefined,
    with: {
      labelsToGrammarPoints: { with: { label: true } },
    },
  } as const;

  const grammarDto = await dbClient.query.grammarPointsTmp.findMany(mainQuery);

  return GrammarPointsDb.toGrammarPoints(grammarDto);
};

export const getExercisesByGrammarPointIds = async (
  grammarPointIds: number[],
  dbClient: DbClient = db,
): Promise<Exercise[]> => {
  const exercisesDto = await dbClient.query.exercisesTmp.findMany({
    where: inArray(exercisesTmp.grammarPointId, grammarPointIds),
    with: {
      parts: {
        with: {
          acceptableAnswers: true,
        },
      },
    },
    orderBy: (exercisesTmp) => [
      exercisesTmp.grammarPointId,
      exercisesTmp.order,
    ],
  });

  return ExercisesDb.toExercises(exercisesDto);
};

export const getExercisesByGrammarPointId = async (
  grammarPointId: number,
  dbClient: DbClient = db,
): Promise<Exercise[]> => {
  const exercisesDto = await dbClient.query.exercisesTmp.findMany({
    where: eq(exercisesTmp.grammarPointId, grammarPointId),
    with: {
      parts: {
        with: {
          acceptableAnswers: true,
        },
      },
    },
  });

  return ExercisesDb.toExercises(exercisesDto);
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

const deleteLabelsFrom = (
  tx: Transaction | DbClient,
  grammarPointId: number,
): ResultAsync<unknown, string> => {
  return ResultAsync.fromPromise(
    tx
      .delete(labelsToGrammarPoints)
      .where(eq(labelsToGrammarPoints.grammarPointId, grammarPointId))
      .execute(),
    () =>
      `Failed to delete existing labels from grammar point: ${grammarPointId}.`,
  );
};

const assignLabelsTo = (
  tx: Transaction | DbClient,
  grammarPointId: number,
  labels: number[],
): ResultAsync<unknown, string> => {
  if (!labels.length) {
    return okAsync(true);
  }

  return ResultAsync.fromPromise(
    tx
      .insert(labelsToGrammarPoints)
      .values(
        labels.map((labelId) => ({
          grammarPointId,
          labelId,
        })),
      )
      .execute(),
    () =>
      `Failed to assign new labels to grammar point: ${grammarPointId}. ${labels.join(", ")}`,
  );
};

const changeLabels = (
  tx: Transaction | DbClient,
  grammarPointId: number,
  labels: number[],
): ResultAsync<true, string> => {
  return deleteLabelsFrom(tx, grammarPointId)
    .andThen(() => assignLabelsTo(tx, grammarPointId, labels))
    .map(() => true);
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

  if (Object.values(updateData).every((value) => value === undefined)) {
    return err("At least one field is required to update a grammar point.");
  }

  await db
    .update(grammarPointsTmp)
    .set(updateData)
    .where(eq(grammarPointsTmp.id, +id));

  if (updateData?.labels) {
    // biome-ignore lint/style/noNonNullAssertion: <not null>
    return changeLabels(db, +id, updateData.labels!);
  }

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

  console.log("Exercises to create before inserting:", exercisesToCreate);

  for (const exercise of exercisesToCreate) {
    const insertedExercise = await tx
      .insert(exercisesTmp)
      .values({ ...exercise })
      .returning();

    await createParts(tx, insertedExercise[0].id, exercise.parts);
  }
  return ok(true);
};

const createParts = async (
  tx: Transaction,
  exerciseId: number,
  partsToCreate: PartToCreateDb[],
) => {
  const inserted = await tx
    .insert(exercisePartsTmp)
    .values(
      partsToCreate.map((part) => ({
        exerciseId,
        ...part,
      })),
    )
    .returning();

  const acceptableAnswersToInsert = partsToCreate
    .filter((p) => p.language === "ru")
    .flatMap((part) => {
      const partId = inserted.find((i) => i.order === part.order)?.id;
      if (!part.acceptableAnswers || !partId) {
        return [];
      }
      return part.acceptableAnswers.map((answer) => ({
        ...answer,
        answerId: partId,
      }));
    });

  acceptableAnswersToInsert.length &&
    (await tx.insert(acceptableAnswersTmp).values(acceptableAnswersToInsert));

  return ok(true);
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
  db: DbClient,
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

  const gp = await getGrammarPoint(+grammarPointId, db);

  if (!gp) {
    return err(
      `Grammar point ${grammarPointId} should exist before creating exercises. Please create the grammar point first.`,
    );
  }

  const existingExercises = await getExercisesByGrammarPointId(
    +grammarPointId,
    db,
  );

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

export const getLabels = async (
  context: Context,
  dbClient: DbClient = db,
): Promise<Result<Label[], string | AuthorizationError>> => {
  if (!Context.isAdmin(context)) {
    return err(
      new AuthorizationError(
        "Currently users without admin rights cannot view labels.",
      ),
    );
  }

  try {
    const labels = await dbClient.query.labels.findMany();
    return ok(LabelsDb.toLabels(labels));
  } catch (error) {
    return err(String(error));
  }
};

export const createLabel = async (
  db: DbClient,
  label: CreateLabel,
  context: Context,
): Promise<Result<Label, string | AuthorizationError>> => {
  if (!Context.isAdmin(context)) {
    return err(
      new AuthorizationError(
        "Currently users without admin rights cannot create labels.",
      ),
    );
  }

  try {
    const [created] = await db.insert(labels).values(label).returning();

    return ok(LabelDb.toLabel(created));
  } catch (error) {
    return err(String(error));
  }
};

/** @public */
export const updateLabel = async (
  db: DbClient,
  update: UpdateLabel,
  context: Context,
): Promise<Result<true, string | AuthorizationError>> => {
  if (!Context.isAdmin(context)) {
    return err(
      new AuthorizationError(
        "Currently users without admin rights cannot update labels.",
      ),
    );
  }

  const existing = await getLabels(context, db);
  if (existing.isErr()) {
    return err(existing.error);
  }

  if (!existing.value.some((label) => label.id === update.id)) {
    return err(`Label with id ${update.id} does not exist.`);
  }

  const { id, ...updateData } = update;

  if (Object.values(updateData).every((value) => value === undefined)) {
    return err("At least one field is required to update a label.");
  }

  try {
    await db.update(labels).set(updateData).where(eq(labels.id, id));

    return ok(true);
  } catch (error) {
    return err(String(error));
  }
};
