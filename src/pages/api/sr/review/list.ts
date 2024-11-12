import type { APIRoute } from "astro";
import { listGrammarPointsInReview } from "../../../../server/feature/space-repetition";

export const GET: APIRoute = async ({ locals: { user } }) => {
  const nextRoundCount = user && (await listGrammarPointsInReview(user));
  return new Response(JSON.stringify(nextRoundCount), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
