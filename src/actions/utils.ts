import { ActionError, type ActionAPIContext } from "astro:actions";
import type { Context } from "grammar-sdk";
import { isUserAdmin } from "libs/auth/admin";

export const extractUser = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }
  return user;
};

export const makeContext = (context: ActionAPIContext): Context => {
  const user = context.locals.user;
  if (!user) {
    return { user: { role: "guest" } };
  }
  return {
    user: { role: isUserAdmin(user) ? "admin" : "user" },
  };
};
