import type { APIRoute } from "astro";
import { removeFromDrill } from "../../../server/drill";

// TODO: move to [id].ts
export const DELETE: APIRoute = async ({ params, locals: { user } }) => {
  user && params.id && (await removeFromDrill(user, params.id));

  return new Response(null, {
    status: 200,
  });
};
