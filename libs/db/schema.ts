import { pgSchema, serial, text, integer } from "drizzle-orm/pg-core";

export const grumma = pgSchema('grumma')

export const grammarPoint = grumma.table('GrammarPoint', {
  id: integer('id').primaryKey(),
  order: integer(),
  structure: text(),
  title: text().notNull().unique(),
});

export const exercise = grumma.table('Exercise', {
  id: serial().primaryKey(),
  grammarPointId: integer().notNull().references(() => grammarPoint.id),
  order: integer().notNull(),
  ru: text().notNull(),
  en: text().notNull(),
  helper: text(),
});
