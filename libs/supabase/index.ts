import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  type CookieOptionsWithName,
} from "@supabase/ssr";
import type { AstroCookies, AstroGlobal } from "astro";

const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

export function createSupabaseServerInstance(
  context:
    | {
        headers: Headers;
        cookies: AstroCookies;
      }
    | AstroGlobal,
) {
  const headers =
    "headers" in context ? context.headers : context.request.headers;

  const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return parseCookieHeader(headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            context.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return supabase;
}

export function createSupabaseClientInstance() {
  return createBrowserClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
  );
}
