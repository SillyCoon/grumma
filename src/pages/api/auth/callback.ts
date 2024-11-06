import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "libs/supabase";

export const GET: APIRoute = async ({ cookies, request, url, redirect }) => {
	console.log("CODE COE CODE");

	const authCode = url.searchParams.get("code");
	if (!authCode) {
		return new Response("No code provided", { status: 400 });
	}

	const supabase = createSupabaseServerInstance({
		cookies,
		headers: request.headers,
	});
	const { error, data } = await supabase.auth.exchangeCodeForSession(authCode);

	if (error) {
		return new Response(error.message, { status: 500 });
	}
	return redirect("/grammar");
};
