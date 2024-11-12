import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "libs/supabase";

const PATHS_TO_IGNORE = [
  "signin",
  "register",
  "auth",
  "login",
  "logout",
  "grammar",
  "help",
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    const { data } = await supabase.auth.getUser();
    locals.user = data.user;

    if (
      PATHS_TO_IGNORE.some((path) => pathHas(url, path) || isWelcomePage(url))
    ) {
      return next();
    }

    if (!data.user) {
      return redirect("/");
    }

    return next();
  },
);

const pathHas = (url: URL, part: string) => url.pathname.includes(part);
const isWelcomePage = (url: URL) => url.pathname === "/";
