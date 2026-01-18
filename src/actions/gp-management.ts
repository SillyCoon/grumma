import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import { isUserAdmin } from "libs/auth/admin";
import { extractUser } from "./utils";
import { grammarPointsTmp } from "libs/db/schema-tmp";
import { db } from "libs/db";
import { eq } from "drizzle-orm";

export const gpManagement = {
  createGrammarPoint: defineAction({
    accept: "form",
    input: z.object({
      shortTitle: z.string().min(1),
      detailedTitle: z.string().min(1),
      englishTitle: z.string().optional(),
      order: z.number().int().positive(),
      structure: z.string().optional(),
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
        const allPoints = await db
          .select({ maxId: grammarPointsTmp.id })
          .from(grammarPointsTmp);
        const maxId = allPoints.reduce(
          (max, curr) => Math.max(curr.maxId, max),
          0,
        );
        const newId = maxId + 1;

        const insertResult = await db
          .insert(grammarPointsTmp)
          .values({
            id: newId,
            ...input,
          })
          .returning();

        return insertResult[0];
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Failed to create grammar point: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    },
  }),
  updateGrammarPoint: defineAction({
    accept: "json",
    input: z.object({
      id: z.number().int().positive(),
      shortTitle: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      order: z.number().int().positive().optional(),
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
};
