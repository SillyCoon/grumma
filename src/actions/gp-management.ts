import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { exerciseSchema } from "packages/grammar-sdk/src/exercise";
import { contextFromAstro } from "~/libs/context";
import {
  type AuthorizationError,
  createGrammarPoint,
  isAuthorizationError,
  putExercises,
  updateGrammarPoint,
  updateGrammarPointsOrder,
} from "packages/grammar-sdk/src/db-new";
import { fetchGrammarPoint } from "grammar-sdk";

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
  putExercises: defineAction({
    accept: "json",
    input: z.object({
      exercises: exerciseSchema.array().min(1),
    }),
    handler: async (input, context) => {
      const result = await putExercises(
        input.exercises,
        contextFromAstro(context),
      );
      const gp = await fetchGrammarPoint(
        input.exercises[0].grammarPointId,
        contextFromAstro(context),
      );
      if (!gp) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Grammar point not found.",
        });
      }

      if (result.isErr()) {
        handleError(result.error);
      }
      return gp.exercises;
    },
  }),
};
