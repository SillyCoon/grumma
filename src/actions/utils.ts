import { ActionError, type ActionAPIContext } from "astro:actions";

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
