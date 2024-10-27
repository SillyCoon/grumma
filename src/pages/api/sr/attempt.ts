import type { APIRoute } from "astro";
import { addAttempt } from "../../../server/feature/space-repetition";
import type { Attempt } from "../../../server/feature/space-repetition/types/Attempt";

export const POST: APIRoute = async ({ locals: { user }, request }) => {
	const attempt = (await request.json()) as Attempt;
	user && (await addAttempt(attempt, user));

	return new Response(null, {
		status: 200,
	});
};
