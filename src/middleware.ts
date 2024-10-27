import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";
import type { User } from "./models/user";

export const onRequest = defineMiddleware(async (context, next) => {
	const authMiddleware = async () => {
		const session = await getSession(context.request);
		if (!session?.user) {
			return context.redirect("/");
		}
		context.locals.user = session.user;
		try {
			const response = await next();
			return response;
		} catch (e) {
			console.log(e);
			return new Response(null, {
				status: 500,
			});
		}
	};

	if (!pathHas(context.url, "auth") && !isWelcomePage(context.url)) {
		return authMiddleware();
	}

	context.locals.user = (await getSession(context.request))?.user;
	return next();
});

const pathHas = (url: URL, part: string) => url.pathname.includes(part);
const isWelcomePage = (url: URL) => url.pathname === "/";
