import type { ActionAPIContext } from "astro:actions";
import { isUserAdmin } from "libs/auth/admin";
import type { Context } from "packages/grammar-sdk/src/context";

export const contextFromAstro = (context: ActionAPIContext): Context => {
  const user = context.locals.user;
  if (!user) {
    return { user: { role: "guest" } };
  }
  return {
    user: {
      role: isUserAdmin(user) ? "admin" : "user",
    },
  };
};
