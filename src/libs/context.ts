import type { ActionAPIContext } from "astro:actions";
import { isUserAdmin } from "libs/auth/admin";
import type { Context } from "grammar-sdk";

export const contextFromAstro = (context: ActionAPIContext): Context => {
  const user = context.locals.user;
  if (!user) {
    return { user: { role: "guest", id: undefined } };
  }
  return {
    user: {
      id: user.id,
      role: isUserAdmin(user) ? "admin" : "user",
    },
  };
};
