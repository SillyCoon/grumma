import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createSupabaseServerInstance } from "libs/supabase";

export function getBaseUrl(): string {
	return (
		import.meta.env.PUBLIC_URL || `http://localhost:${process.env.PORT ?? 4321}`
	);
}

export const server = {
	login: defineAction({
		accept: "form",
		input: z.object({
			provider: z.string(),
		}),
		handler: async (input, context) => {
			console.log("Base URL", getBaseUrl());
			console.log("META", import.meta.env);

			const baseUrl = getBaseUrl();
			const supabase = createSupabaseServerInstance({
				headers: context.request.headers,
				cookies: context.cookies,
			});
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${baseUrl}/api/auth/callback`,
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
};
