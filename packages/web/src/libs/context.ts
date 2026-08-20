import type { ActionAPIContext } from "astro:actions";
import { Context } from "auth";

export const contextFromAstro = (context: ActionAPIContext): Context => {
  const user = context.locals.user;
  if (!user) {
    return { user: { role: "guest", id: undefined } };
  }
  return Context.fromUser(user);
};
