import type { User as SbUser } from "@supabase/supabase-js";

export type User = Pick<SbUser, "email" | "id">;
