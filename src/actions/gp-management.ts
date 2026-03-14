import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { isUserAdmin } from "libs/auth/admin";
import { extractUser } from "./utils";
import {
  grammarPointsTmp,
  exercisePartsTmp,
  acceptableAnswersTmp,
  exercisesTmp,
} from "libs/db/schema-tmp";
import { db, type Transaction } from "libs/db";
import { eq } from "drizzle-orm";
import {
  exerciseSchema,
  type Exercise,
  type ExercisePart,
} from "grammar-sdk/exercise";
import { contextFromAstro } from "~/libs/context";
import {
  type AuthorizationError,
  createGrammarPoint,
  isAuthorizationError,
  updateGrammarPoint,
  updateGrammarPointsOrder,
} from "packages/grammar-sdk";

const handleError = (error: string | AuthorizationError) => {
  if (isAuthorizationError(error)) {
    throw new ActionError({
      code: "FORBIDDEN",
      message: error.message,
    });
  }
  throw new ActionError({
    code: "BAD_REQUEST",
    message: `${error}`,
  });
};

export const gpManagement = {
  createGrammarPoint: defineAction({
    accept: "form",
    input: z.object({
      shortTitle: z.string().min(1),
      detailedTitle: z.string().min(1),
      englishTitle: z.string().optional(),
      structure: z.string().optional(),
      explanation: z.string().optional(),
      torfl: z.string().optional(),
    }),
    handler: async (input, context) => {
      const result = await createGrammarPoint(input, contextFromAstro(context));
      if (result.isOk()) {
        return { id: result.value };
      }
      if (result.isErr()) {
        if (isAuthorizationError(result.error)) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: result.error.message,
          });
        }
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `${result.error}`,
        });
      }
    },
  }),
  updateGrammarPoint: defineAction({
    accept: "form",
    input: z.object({
      id: z.number().int().positive(),
      shortTitle: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      structure: z.string().optional(),
      detailedTitle: z.string().optional(),
      englishTitle: z.string().optional(),
      torfl: z.string().optional(),
    }),
    handler: async (input, context) => {
      const result = await updateGrammarPoint(
        { ...input, id: `${input.id}` },
        contextFromAstro(context),
      );
      if (result.isOk()) {
        return { success: true };
      }
      if (result.isErr()) {
        handleError(result.error);
      }
    },
  }),
  updateGrammarPointsOrder: defineAction({
    accept: "json",
    input: z.array(
      z.object({
        id: z.number().int().positive(),
        order: z.number().int().nonnegative(),
      }),
    ),
    handler: async (input, context) => {
      const result = await updateGrammarPointsOrder(
        input.map((o) => ({ id: `${o.id}`, order: o.order })),
        contextFromAstro(context),
      );
      if (result.isOk()) {
        return { success: true };
      }
      if (result.isErr()) {
        handleError(result.error);
      }
    },
  }),
  createExercises: defineAction({
    accept: "json",
    input: z.object({
      grammarPointId: z.number().int().positive(),
      exercises: exerciseSchema.array().min(1),
    }),
    handler: async (input, context) => {
      console.log("Creating exercises:", input);
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required to create exercises",
        });
      }

      try {
        await db.transaction(async (tx) => {
          await createExercises(tx, input.grammarPointId, input.exercises);
        });

        return input;
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to create exercises: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    },
  }),
  putExercises: defineAction({
    accept: "json",
    input: z.object({
      grammarPointId: z.number().int().positive(),
      exercises: exerciseSchema.array().min(1),
    }),
    handler: async (input, context) => {
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required to update exercises",
        });
      }

      const dbExercises = new Set(
        (
          await db
            .select({ id: exercisesTmp.id })
            .from(exercisesTmp)
            .where(eq(exercisesTmp.grammarPointId, input.grammarPointId))
        ).map(({ id }) => id),
      );

      const newExercises = input.exercises.filter((ex) => !ex.id);
      const existingExercises = input.exercises.filter(
        (ex) => ex.id && dbExercises.has(ex.id),
      );

      console.log("Updating exercises:", {
        grammarPointId: input.grammarPointId,
        dbExercises,
        newExercises,
        existingExercises,
      });

      try {
        await db.transaction(async (tx) => {
          await putExercises(tx, existingExercises);
          await createExercises(tx, input.grammarPointId, newExercises);
        });

        const data = await db.query.exercisesTmp.findMany({
          where: eq(exercisesTmp.grammarPointId, input.grammarPointId),
          orderBy: (ex, { asc }) => asc(ex.order),
          with: {
            parts: {
              orderBy: (part, { asc }) => asc(part.order),
              with: {
                acceptableAnswers: true,
              },
            },
          },
        });
        const resultExercises: Exercise[] = data.map((exercise) => ({
          id: exercise.id,
          grammarPointId: exercise.grammarPointId.toString(),
          hide: exercise.hide,
          order: exercise.order,
          parts: exercise.parts
            .filter((part) => part.language === "ru")
            .map((part) => {
              if (part.type === "answer") {
                return {
                  id: part.id,
                  index: part.order,
                  type: part.type,
                  text: part.text,
                  description: part.description ?? undefined,
                  acceptableAnswers: part.acceptableAnswers.map((ans) => ({
                    id: ans.id,
                    text: ans.text,
                    description: ans.description ?? undefined,
                    variant: ans.variant,
                  })),
                };
              }
              return {
                id: part.id,
                index: part.order,
                type: part.type,
                text: part.text,
                description: part.description ?? undefined,
              };
            }),
          translationParts: exercise.parts
            .filter((part) => part.language === "en")
            .map((part) => {
              return {
                id: part.id,
                index: part.order,
                type: part.type,
                text: part.text,
                description: part.description ?? undefined,
              };
            }),
        }));
        return resultExercises;
      } catch (error) {
        console.error(error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to update exercises: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    },
  }),
  getExercisesByGrammarPointId: defineAction({
    accept: "json",
    input: z.object({
      grammarPointId: z.number().int().positive(),
    }),
    handler: async ({ grammarPointId }, context) => {
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      try {
        const data = await db.query.exercisesTmp.findMany({
          where: eq(exercisesTmp.grammarPointId, grammarPointId),
          orderBy: (ex, { asc }) => asc(ex.order),
          with: {
            parts: {
              orderBy: (part, { asc }) => asc(part.order),
              with: {
                acceptableAnswers: true,
              },
            },
          },
        });
        const result: Exercise[] = data.map((exercise) => ({
          id: exercise.id,
          grammarPointId: exercise.grammarPointId.toString(),
          hide: exercise.hide,
          order: exercise.order,
          parts: exercise.parts
            .filter((part) => part.language === "ru")
            .map((part) => {
              if (part.type === "answer") {
                return {
                  id: part.id,
                  index: part.order,
                  type: part.type,
                  text: part.text,
                  description: part.description ?? undefined,
                  acceptableAnswers: part.acceptableAnswers.map((ans) => ({
                    id: ans.id,
                    text: ans.text,
                    description: ans.description ?? undefined,
                    variant: ans.variant,
                  })),
                };
              }
              return {
                id: part.id,
                index: part.order,
                type: part.type,
                text: part.text,
                description: part.description || undefined,
              };
            }),
          translationParts: exercise.parts
            .filter((part) => part.language === "en")
            .map((part) => {
              return {
                id: part.id,
                index: part.order,
                type: part.type,
                text: part.text,
                description: part.description ?? undefined,
              };
            }),
        }));
        return result;
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to fetch exercises: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    },
  }),
};

/**
 * Create exercise for grammar point only. Order is unique for grammar point
 */
const createExercises = async (
  tx: Transaction,
  grammarPointId: number,
  exercises: Exercise[],
) => {
  const insertedMap = new Map<number, number>();
  for (const exercise of exercises) {
    const insertedExercise = await tx
      .insert(exercisesTmp)
      .values({
        grammarPointId: grammarPointId,
        order: exercise.order,
        hide: exercise.hide,
      })
      .returning();

    await createParts(
      tx,
      insertedExercise[0].id,
      exercise.parts,
      exercise.translationParts,
    );
    insertedMap.set(exercise.order, insertedExercise[0].id);
  }
  return insertedMap;
};

const toDbPart = (exercisePart: ExercisePart, language: "ru" | "en") => {
  return {
    order: exercisePart.index,
    type: exercisePart.type,
    text: exercisePart.text,
    description:
      "description" in exercisePart ? exercisePart.description || null : null,
    language,
  };
};

const createParts = async (
  tx: Transaction,
  exerciseId: number,
  parts: Exercise["parts"],
  translationParts: Exercise["parts"],
) => {
  const insertedPart = await tx
    .insert(exercisePartsTmp)
    .values(
      parts.map((part) => ({
        exerciseId: exerciseId,
        ...toDbPart(part, "ru"),
      })),
    )
    .returning();

  const acceptableAnswersToInsert = insertedPart.flatMap((part, idx) => {
    const originalPart = parts[idx];
    if (originalPart.type === "answer" && originalPart.acceptableAnswers) {
      return originalPart.acceptableAnswers.map((a) => ({
        answerId: part.id,
        text: a.text,
        description: a.description || null,
        variant: a.variant,
      }));
    }
    return [];
  });

  acceptableAnswersToInsert.length &&
    (await tx.insert(acceptableAnswersTmp).values(acceptableAnswersToInsert));

  await tx
    .insert(exercisePartsTmp)
    .values(
      translationParts.map((part) => ({
        exerciseId: exerciseId,
        ...toDbPart(part, "en"),
      })),
    )
    .returning();
};

const putExercises = async (tx: Transaction, exercises: Exercise[]) => {
  for (const exercise of exercises) {
    if (!exercise.id) continue;

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

    await createParts(
      tx,
      exercise.id,
      exercise.parts,
      exercise.translationParts,
    );
  }
};
