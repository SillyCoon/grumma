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
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_KEY ?? "",
    {
      cookieOptions,
      cookies: {
        getAll() {
          return parseCookieHeader(headers.get("Cookie") ?? "").filter(
            (cookie): cookie is { name: string; value: string } =>
              cookie.value !== undefined,
          );
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            context.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  return supabase;
}

/**
 * @deprecated Despite the name, should not be used on client
 */
export function createSupabaseClientInstance() {
  return createBrowserClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_KEY ?? "",
  );
}
