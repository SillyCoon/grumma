// With `output: 'hybrid'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "libs/supabase";

export const GET: APIRoute = async ({ cookies, redirect }) => {
	cookies.delete("sb-access-token", { path: "/" });
	cookies.delete("sb-refresh-token", { path: "/" });
	await supabase.auth.signOut();
	return redirect("/signin");
};
