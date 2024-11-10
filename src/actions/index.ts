import { ActionError, defineAction } from "astro:actions";
import { PUBLIC_URL } from "astro:env/server";
import { z } from "astro:schema";
import { createSupabaseServerInstance } from "libs/supabase";
import { fetchGrammarPointFromDb } from "~/grammar-sdk/db";
import { addAttempt } from "~/server/feature/space-repetition";
import type { Stage } from "~/server/feature/space-repetition/types/Stage";

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
			return fetchGrammarPointFromDb(input.grammarPointId);
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
			const user = context.locals.user;
			if (!user) {
				console.log("User is not logged in, can't save attempt");
			}
			user &&
				(await addAttempt({ ...input, stage: input.stage as Stage }, user));
		},
	}),
};
