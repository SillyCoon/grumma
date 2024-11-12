import type { APIRoute } from "astro";
import { addToDrill, getDrill } from "../../../server/drill";
import type { GrammarPoint } from "@grammar-sdk";

export const POST: APIRoute = async ({ locals: { user }, request }) => {
  const gp = (await request.json()) as GrammarPoint;
  user && (await addToDrill(user, gp));

  return new Response(null, {
    status: 200,
  });
};

export const GET: APIRoute = async ({ locals: { user } }) => {
  const drill = user && (await getDrill(user));

  return new Response(JSON.stringify(drill), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
