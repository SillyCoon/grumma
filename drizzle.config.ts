import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./packages/db/schema.ts", "./packages/db/schema-tmp.ts"],
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  schemaFilter: ["grumma", "tmp", "cache"],
  tablesFilter: ["*"],
  verbose: true,
});
