import type { User as AuthUser } from "@auth/core/types";

export type User = Pick<AuthUser, "id" | "email" | "name">;
