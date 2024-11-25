import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? "";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
export type DbClient = typeof db;

export const makeDb = (connectionString: string) =>
  drizzle(postgres(connectionString, { prepare: false }), { schema });
