import type { APIRoute } from "astro";
import { addToDrill, getDrill } from "../../../server/drill";
import type { GrammarPointType } from "../../../services/grammar";

export const POST: APIRoute = async ({ locals: { user }, request }) => {
	const gp = (await request.json()) as GrammarPointType;
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
