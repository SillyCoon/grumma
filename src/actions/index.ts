import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { PUBLIC_URL } from "astro:env/server";
import { z } from "astro:schema";
import { fetchGrammarPoint } from "grammar-sdk";
import { db } from "libs/db";
import { createSupabaseServerInstance } from "libs/supabase";
import { saveFeedback } from "packages/feedback";
import type { Stage } from "space-repetition";
import {
  addAttempt,
  addToRepetitions,
  countNextRound,
  countStreak,
  getInReviewByTorfl,
  getSchedule,
  getSessionResult,
} from "space-repetition";

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

export const SignupErrors = new Map([
  ["weak_password", "Password is too weak, please use 8 symbols or more"],
  ["user_already_exists", "User with this email already exists"],
  ["default", "Something went wrong, please try again"],
  ["user_not_found", "Invalid email or password"],
  ["invalid_credentials", "Invalid email or password"],
  ["email_address_invalid", "Invalid email address format"],
]);

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
        const message =
          (error.code && SignupErrors.get(error.code)) ??
          SignupErrors.get("default");

        throw new ActionError({
          code: "FORBIDDEN",
          message,
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
        const message =
          (error.code && SignupErrors.get(error.code)) ??
          SignupErrors.get("default");

        throw new ActionError({
          code: "FORBIDDEN",
          message,
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
    input: z.object({
      today: z.coerce.date(),
    }),
    handler: async ({ today }, context) => {
      const user = extractUser(context);

      return {
        streak: await countStreak(today, user),
        inReviewByTorflCount: await getInReviewByTorfl(user),
        reviewsCount: await countNextRound(user),
        schedule: await getSchedule(user),
      };
    },
  }),
  sessionResult: defineAction({
    accept: "json",
    input: z.object({
      sessionId: z.string(),
    }),
    handler: async ({ sessionId }, context) => {
      const user = extractUser(context);
      return await getSessionResult(user, sessionId);
    },
  }),
  saveFeedback: defineAction({
    accept: "json",
    input: z.object({
      email: z.string().email().optional(),
      grammar: z
        .object({
          grammarPointId: z.number().int(),
          exerciseOrder: z.number().int(),
        })
        .optional(),
      message: z.string(),
    }),
    handler: async (feedback, context) => {
      const user = extractUser(context);
      await saveFeedback(db, {
        ...feedback,
        userId: user.id,
        createdAt: new Date(),
      });
    },
  }),
  addToReview: defineAction({
    accept: "json",
    input: z.object({
      grammarPointId: z.string(),
    }),
    handler: async ({ grammarPointId }, context) => {
      const user = extractUser(context);
      await addToRepetitions(db, user, grammarPointId, new Date());
      return { success: true };
    },
  }),
};
