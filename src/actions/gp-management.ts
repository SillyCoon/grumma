import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import { isUserAdmin } from "libs/auth/admin";
import { extractUser } from "./utils";
import {
  grammarPointsTmp,
  exercisePartsTmp,
  acceptableAnswersTmp,
  exercisesTmp,
} from "libs/db/schema-tmp";
import { db, type Transaction } from "libs/db";
import { eq, max, sql } from "drizzle-orm";
import { exerciseSchema, type Exercise } from "~/features/exercise/domain";

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
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required to create grammar points",
        });
      }

      try {
        const [{ maxOrder }] = await db
          .select({ maxOrder: max(grammarPointsTmp.order) })
          .from(grammarPointsTmp);

        const [insertResult] = await db
          .insert(grammarPointsTmp)
          .values({
            order: (maxOrder ?? 0) + 1,
            ...input,
          })
          .returning();

        return insertResult;
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to create grammar point: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required to update grammar points",
        });
      }

      const { id, ...updateData } = input;

      try {
        const result = await db
          .update(grammarPointsTmp)
          .set(updateData)
          .where(eq(grammarPointsTmp.id, id))
          .returning();

        if (!result.length) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Grammar point not found",
          });
        }

        return result[0];
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to update grammar point: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
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
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required to update grammar points order",
        });
      }

      const sqlA = sql`
          UPDATE ${grammarPointsTmp} o
          SET "order" = v.new_order
          FROM (
            VALUES
              ${sql.join(
                input.map((o) => sql`(${o.id}::int, ${o.order}::int)`),
                sql`, `,
              )}
          ) AS v(id, new_order)
          WHERE o.id = v.id
        `;

      try {
        await db.execute(sqlA);

        return input;
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to update grammar points order: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    },
  }),
  getAllGrammarPoints: defineAction({
    accept: "json",
    handler: async (_, context) => {
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      try {
        return await db.query.grammarPointsTmp.findMany({
          orderBy: (gp, { asc }) => asc(gp.order),
        });
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to fetch grammar points: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    },
  }),
  getGrammarPointById: defineAction({
    accept: "json",
    input: z.object({
      id: z.number().int().positive(),
    }),
    handler: async ({ id }, context) => {
      const user = extractUser(context);
      if (!isUserAdmin(user)) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      try {
        const result = await db.query.grammarPointsTmp.findFirst({
          where: eq(grammarPointsTmp.id, id),
          with: {
            exercises: {
              orderBy: (ex, { asc }) => asc(ex.order),
            },
          },
        });

        if (!result) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Grammar point not found",
          });
        }

        return result;
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to fetch grammar point: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
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
  createOrUpdateExercises: defineAction({
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

      const newExercises = input.exercises.filter((ex) => !ex.id);
      const existingExercises = input.exercises.filter((ex) => ex.id);

      try {
        await db.transaction(async (tx) => {
          await createExercises(tx, input.grammarPointId, newExercises);
          await putExercises(tx, existingExercises);
        });

        return input;
      } catch (error) {
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
          order: exercise.order,
          parts: exercise.parts.map((part) => {
            if (part.type === "answer") {
              return {
                index: part.order,
                type: part.type,
                text: part.text,
                description: part.description || undefined,
                acceptableAnswers: part.acceptableAnswers.map((ans) => ({
                  text: ans.text,
                  description: ans.description || undefined,
                  variant: ans.variant,
                })),
              };
            }
            return {
              index: part.order,
              type: part.type,
              text: part.text,
              description: part.description || undefined,
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

const createExercises = async (
  tx: Transaction,
  grammarPointId: number,
  exercises: Exercise[],
) => {
  for (const exercise of exercises) {
    const insertedExercise = await tx
      .insert(exercisesTmp)
      .values({
        grammarPointId: grammarPointId,
        order: exercise.order,
      })
      .returning();

    await createParts(tx, insertedExercise[0].id, exercise.parts);
  }
};

const createParts = async (
  tx: Transaction,
  exerciseId: number,
  parts: Exercise["parts"],
) => {
  const insertedPart = await tx
    .insert(exercisePartsTmp)
    .values(
      parts.map((part) => ({
        exerciseId: exerciseId,
        order: part.index,
        type: part.type,
        text: part.text,
        description: "description" in part ? part.description : null,
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
};

const putExercises = async (tx: Transaction, exercises: Exercise[]) => {
  for (const exercise of exercises) {
    if (!exercise.id) continue;

    await tx
      .update(exercisesTmp)
      .set({
        order: exercise.order,
      })
      .where(eq(exercisesTmp.id, exercise.id));

    await tx
      .delete(acceptableAnswersTmp)
      .where(eq(acceptableAnswersTmp.answerId, exercise.id))
      .execute();

    await tx
      .delete(exercisePartsTmp)
      .where(eq(exercisePartsTmp.exerciseId, exercise.id))
      .execute();

    await createParts(tx, exercise.id, exercise.parts);
  }
};
