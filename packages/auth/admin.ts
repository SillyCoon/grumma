import type { User } from "./user";

const getAdminEmails = () =>
  new Set((process.env.ADMIN_EMAILS || "").split(",").filter(Boolean));

export const isUserAdmin = (user?: User): boolean => {
  if (!user?.email) return false;
  return getAdminEmails().has(user.email.toLowerCase());
};
