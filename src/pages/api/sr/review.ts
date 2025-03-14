import type { APIRoute } from "astro";
import { getNextRound } from "space-repetition";

export const GET: APIRoute = async ({ locals: { user } }) => {
  const nextRound = user && (await getNextRound(user));
  return new Response(JSON.stringify(nextRound), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
