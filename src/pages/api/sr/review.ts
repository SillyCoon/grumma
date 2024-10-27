import type { APIRoute } from "astro";
import { getNextRound } from "../../../server/feature/space-repetition";

export const GET: APIRoute = async ({ locals: { user }, request }) => {
	const nextRound = user && (await getNextRound(user));
	return new Response(JSON.stringify(nextRound), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
