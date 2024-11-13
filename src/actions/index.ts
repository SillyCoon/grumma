import { fetchGrammarPoint } from "@grammar-sdk";
import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { PUBLIC_URL } from "astro:env/server";
import { z } from "astro:schema";
import { createSupabaseServerInstance } from "libs/supabase";
import { addAttempt, countNextRound } from "~/server/feature/space-repetition";
import type { Stage } from "~/server/feature/space-repetition/types/Stage";

const extractUser = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }
  return user;
};

export const server = {
  login: defineAction({
    accept: "form",
    input: z.object({
      provider: z.string(),
    }),
    handler: async (_input, context) => {
      const supabase = createSupabaseServerInstance({
        headers: context.request.headers,
        cookies: context.cookies,
      });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.PUBLIC_URL || PUBLIC_URL}/api/auth/callback`,
        },
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Failed to sign in",
        });
      }
      return {
        url: data.url,
      };
    },
  }),
  logout: defineAction({
    accept: "form",
    handler: async (_, context) => {
      const supabase = createSupabaseServerInstance({
        headers: context.request.headers,
        cookies: context.cookies,
      });
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Failed to sign in",
        });
      }
      return {
        ok: true,
      };
    },
  }),
  grammarPoint: defineAction({
    accept: "json",
    input: z.object({
      grammarPointId: z.string(),
    }),
    handler: async (input, _context) => {
      return fetchGrammarPoint(input.grammarPointId);
    },
  }),
  saveAttempt: defineAction({
    accept: "json",
    input: z.object({
      grammarPointId: z.string(),
      stage: z.number(),
      answer: z.string(),
      isCorrect: z.boolean(),
      answeredAt: z.coerce.date(),
      reviewSessionId: z.string(),
    }),
    handler: async (input, context) => {
      const user = extractUser(context);
      user &&
        (await addAttempt({ ...input, stage: input.stage as Stage }, user));
    },
  }),
  dashboard: defineAction({
    accept: "json",
    handler: async (_input, context) => {
      const nextRound = await countNextRound(extractUser(context));
      return {
        streak: 5,
        inReviewByTorflCount: [
          { torfl: "A1", count: 5, total: 10 },
          { torfl: "A2", count: 10, total: 20 },
        ],
        reviewsCount: nextRound,
      };
    },
  }),
};
