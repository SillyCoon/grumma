import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as tmpSchema from "./schema-tmp";

const connectionString = process.env.DATABASE_URL ?? "";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema: { ...schema, ...tmpSchema } });
export type DbClient = typeof db;

export const makeDb = (connectionString: string) =>
  drizzle(postgres(connectionString, { prepare: false }), {
    schema: { ...schema, ...tmpSchema },
  });

export type Database = typeof db;
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
