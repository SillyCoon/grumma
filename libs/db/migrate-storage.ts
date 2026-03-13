import { drizzle } from "drizzle-orm/postgres-js";
import { readdir } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import * as tmpSchema from "./schema-tmp";
import { eq } from "drizzle-orm/sql";

const connectionString = process.env.DATABASE_URL ?? "";

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema: tmpSchema });

const files = await readdir(path.resolve(__dirname, "./supabase-files"));
for (const filename of files) {
  const file = Bun.file(path.resolve(__dirname, "./supabase-files", filename));
  const content = await file.text();
  const id = filename.split(".")[0].split("-")[1];
  console.log(`Migrating grammar point with id ${id}... file: ${filename}`);
  await db
    .update(tmpSchema.grammarPointsTmp)
    .set({
      explanation: content,
    })
    .where(eq(tmpSchema.grammarPointsTmp.id, +id));
}

process.exit(0);
