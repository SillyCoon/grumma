import type { APIRoute } from "astro";
import { getSchedule } from "space-repetition";

export const GET: APIRoute = async ({ locals: { user } }) => {
  const schedule = user && (await getSchedule(user));
  return new Response(JSON.stringify(schedule), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
