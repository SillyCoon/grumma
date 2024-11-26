import { fetchGrammarPoint } from "@grammar-sdk";
import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { PUBLIC_URL } from "astro:env/server";
import { z } from "astro:schema";
import { createSupabaseServerInstance } from "libs/supabase";
import {
  addAttempt,
  countNextRound,
  countStreak as getStreak,
  getInReviewByTorfl,
  getSchedule,
} from "~/server/feature/space-repetition";
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
  signup: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    handler: async (input, context) => {
      const supabase = createSupabaseServerInstance({
        headers: context.request.headers,
        cookies: context.cookies,
      });

      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Failed to sign up",
        });
      }

      return data;
    },
  }),
  signin: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    handler: async (input, context) => {
      const supabase = createSupabaseServerInstance({
        headers: context.request.headers,
        cookies: context.cookies,
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Failed to sign in",
        });
      }

      return data;
    },
  }),
  loginWithGoogle: defineAction({
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
      const user = extractUser(context);

      return {
        streak: await getStreak(user),
        inReviewByTorflCount: await getInReviewByTorfl(user),
        reviewsCount: await countNextRound(user),
        schedule: await getSchedule(user),
      };
    },
  }),
};
