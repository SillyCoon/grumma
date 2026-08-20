import { defineMiddleware } from "astro:middleware";
import { Context } from "auth";
import { createSupabaseServerInstance } from "~/libs/supabase";

const PATHS_TO_IGNORE = [
  "signin",
  "signup",
  "register",
  "auth",
  "login",
  "logout",
  "grammar",
  "help",
  "privacy-policy",
  "sitemap.xml",
  "error",
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    const { data } = await supabase.auth.getUser();
    Object.assign(locals, { user: data.user });

    if (
      PATHS_TO_IGNORE.some(
        (path) =>
          pathHas(url, path) || isWelcomePage(url) || pathHas(url, "image"),
      )
    ) {
      return next();
    }

    if (!data.user) {
      return redirect("/");
    }

    if (pathHas(url, "admin")) {
      if (!Context.isAdmin(Context.fromUser(data.user))) {
        return redirect("/");
      }
    }

    return next();
  },
);

const pathHas = (url: URL, part: string) => url.pathname.includes(part);
const isWelcomePage = (url: URL) => url.pathname === "/";
