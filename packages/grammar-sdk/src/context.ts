export type Context = {
  user: { role: "admin" | "user" | "guest" };
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
};
