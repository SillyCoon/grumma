import { isUserAdmin } from "./admin";
import type { User } from "./user";

export type Context = {
  user:
    | { role: "admin" | "user"; id: string }
    | { role: "guest"; id?: undefined };
};

export const Context = {
  isAdmin(ctx: Context) {
    return ctx.user.role === "admin";
  },
  isUser(ctx: Context) {
    return ctx.user.role === "user";
  },
  isGuest(ctx: Context) {
    return ctx.user.role === "guest";
  },
  fromUser(user: User): Context {
    return {
      user: {
        role: isUserAdmin(user) ? "admin" : "user",
        id: user.id,
      },
    };
  },
};
