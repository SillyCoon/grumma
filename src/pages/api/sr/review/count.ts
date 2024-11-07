import type { APIRoute } from "astro";
import { countNextRound } from "../../../../server/feature/space-repetition";

export const GET: APIRoute = async ({ locals: { user } }) => {
	const nextRoundCount = user && (await countNextRound(user));
	return new Response(JSON.stringify(nextRoundCount), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
