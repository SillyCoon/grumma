import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./libs/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  schemaFilter: ["grumma", "tmp"],
  tablesFilter: ["*"],
  verbose: true,
});
