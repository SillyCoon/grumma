import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgSchema,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const grummaTmp = pgSchema("tmp");

const createdAtUpdatedAt = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const grammarPointsTmp = grummaTmp.table("grammar_point_tmp", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  shortTitle: text().notNull().unique(),
  detailedTitle: text(),
  englishTitle: text(),
  order: integer().notNull().unique(),
  structure: text(),
  explanation: text(),
  torfl: varchar({ length: 2 }),
  hide: boolean().notNull().default(true),
  ...createdAtUpdatedAt,
});

export const exercisesTmp = grummaTmp.table("exercise_tmp", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  grammarPointId: integer()
    .notNull()
    .references(() => grammarPointsTmp.id),
  order: integer().notNull().unique(),
  hide: boolean().notNull().default(true),
  ...createdAtUpdatedAt,
});

export const partTypeEnum = grummaTmp.enum("exercisePartType", [
  "text",
  "answer",
]);

export const exercisePartsTmp = grummaTmp.table("exercise_part", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  exerciseId: integer()
    .notNull()
    .references(() => exercisesTmp.id),
  order: integer().notNull(),
  type: partTypeEnum().notNull(),
  text: text().notNull(),
  description: text(),
  language: varchar({ length: 10 }).notNull().default("ru"),
  ...createdAtUpdatedAt,
});

export const variantEnum = grummaTmp.enum("acceptableAnswerVariant", [
  "correct",
  "incorrect",
  "try-again",
]);

export const acceptableAnswersTmp = grummaTmp.table("acceptable_answer", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  answerId: integer()
    .notNull()
    .references(() => exercisePartsTmp.id, { onDelete: "cascade" }),
  text: text().notNull(),
  description: text(),
  variant: variantEnum().notNull(),
  ...createdAtUpdatedAt,
});

export const grammarPointRelationsTmp = relations(
  grammarPointsTmp,
  ({ many }) => ({
    exercises: many(exercisesTmp),
  }),
);

export const exercisesRelationsTmp = relations(
  exercisesTmp,
  ({ many, one }) => ({
    grammarPoint: one(grammarPointsTmp, {
      fields: [exercisesTmp.grammarPointId],
      references: [grammarPointsTmp.id],
    }),
    parts: many(exercisePartsTmp),
  }),
);

export const exercisePartsRelationsTmp = relations(
  exercisePartsTmp,
  ({ many, one }) => ({
    exercise: one(exercisesTmp, {
      fields: [exercisePartsTmp.exerciseId],
      references: [exercisesTmp.id],
    }),
    acceptableAnswers: many(acceptableAnswersTmp),
  }),
);

export const acceptableAnswersRelationsTmp = relations(
  acceptableAnswersTmp,
  ({ one }) => ({
    answer: one(exercisePartsTmp, {
      fields: [acceptableAnswersTmp.answerId],
      references: [exercisePartsTmp.id],
    }),
  }),
);
