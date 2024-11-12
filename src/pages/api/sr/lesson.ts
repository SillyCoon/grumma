import type { APIRoute } from "astro";
import { getLessons } from "../../../server/feature/space-repetition";

export const GET: APIRoute = async ({ locals: { user } }) => {
  const lessons = user && (await getLessons(1, user));

  return new Response(JSON.stringify(lessons), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
