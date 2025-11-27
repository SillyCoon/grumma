import type { User } from "~/models/user";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean),
);

export const isUserAdmin = (user?: User): boolean => {
  if (!user?.email) return false;
  return ADMIN_EMAILS.has(user.email.toLowerCase());
};
