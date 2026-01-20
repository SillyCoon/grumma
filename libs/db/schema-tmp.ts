import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgSchema,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const grumma = pgSchema("tmp");

const createdAtUpdatedAt = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const grammarPointsTmp = grumma.table("grammar_point", {
  id: integer("id").primaryKey(),
  shortTitle: text().notNull().unique(),
  detailedTitle: text().unique(),
  englishTitle: text().unique(),
  order: integer().notNull().unique(),
  structure: text(),
  torfl: varchar({ length: 2 }),
  hide: boolean().notNull().default(true),
  ...createdAtUpdatedAt,
});

export const exercisesTmp = grumma.table("exercise", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  grammarPointId: integer()
    .notNull()
    .references(() => grammarPointsTmp.id),
  order: integer().notNull().unique(),
  ru: text().notNull(),
  en: text().notNull(),
  helper: text(),
  ...createdAtUpdatedAt,
});

export const grammarPointRelationsTmp = relations(
  grammarPointsTmp,
  ({ many }) => ({
    exercises: many(exercisesTmp),
  }),
);

export const exercisesRelationsTmp = relations(exercisesTmp, ({ one }) => ({
  grammarPointId: one(grammarPointsTmp, {
    fields: [exercisesTmp.grammarPointId],
    references: [grammarPointsTmp.id],
  }),
}));
