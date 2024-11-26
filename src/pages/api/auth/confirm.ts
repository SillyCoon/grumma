import type { EmailOtpType } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "libs/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") || "/";

  if (token_hash && type) {
    const supabase = createSupabaseServerInstance({
      headers: request.headers,
      cookies,
    });

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return redirect(next);
    }
  }

  // return the user to an error page with some instructions
  return redirect("/auth/auth-code-error");
};
