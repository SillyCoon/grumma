import { defineMiddleware } from "astro:middleware";
import { supabase } from "libs/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
	const authMiddleware = async () => {
		const accessToken = context.cookies.get("sb-access-token");
		const refreshToken = context.cookies.get("sb-refresh-token");

		if (!accessToken || !refreshToken) {
			return context.redirect("/signin");
		}

		const { data, error } = await supabase.auth.setSession({
			refresh_token: refreshToken.value,
			access_token: accessToken.value,
		});

		if (error) {
			context.cookies.delete("sb-access-token", {
				path: "/",
			});
			context.cookies.delete("sb-refresh-token", {
				path: "/",
			});
			return context.redirect("/signin");
		}

		context.locals.user = data.user;
		if (data.session) {
			context.cookies.set("sb-access-token", data?.session?.access_token, {
				sameSite: "strict",
				path: "/",
				secure: true,
			});
			context.cookies.set("sb-refresh-token", data?.session?.refresh_token, {
				sameSite: "strict",
				path: "/",
				secure: true,
			});
		}
		return next();
	};

	if (
		!pathHas(context.url, "signin") &&
		!pathHas(context.url, "register") &&
		!isWelcomePage(context.url)
	) {
		return authMiddleware();
	}

	return next();
});

const pathHas = (url: URL, part: string) => url.pathname.includes(part);
const isWelcomePage = (url: URL) => url.pathname === "/";
