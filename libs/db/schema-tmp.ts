import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  unique,
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
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  shortTitle: text().notNull().unique(),
  detailedTitle: text(),
  englishTitle: text(),
  order: integer().notNull().unique(),
  structure: text(),
  explanation: text(),
  torfl: varchar({ length: 2 }),
  hide: boolean().notNull().default(true),
  note: text(),
  ...createdAtUpdatedAt,
});

export const labels = grummaTmp.table("label", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 50 }).notNull().unique(),
  color: varchar({ length: 7 }).notNull(), // Hex color code
  ...createdAtUpdatedAt,
});

export const exercisesTmp = grummaTmp.table(
  "exercise_tmp",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    grammarPointId: integer()
      .notNull()
      .references(() => grammarPointsTmp.id),
    order: integer().notNull(),
    hide: boolean().notNull().default(true),
    ...createdAtUpdatedAt,
  },
  (table) => [unique().on(table.grammarPointId, table.order)],
);

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
    labelsToGrammarPoints: many(labelsToGrammarPoints),
  }),
);

export const labelsRelationsTmp = relations(labels, ({ many }) => ({
  labelsToGrammarPoints: many(labelsToGrammarPoints),
}));

export const labelsToGrammarPoints = grummaTmp.table(
  "label_to_grammar_point",
  {
    labelId: integer()
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
    grammarPointId: integer()
      .notNull()
      .references(() => grammarPointsTmp.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.labelId, t.grammarPointId] })],
);

export const labelsToGrammarPointsRelations = relations(
  labelsToGrammarPoints,
  ({ one }) => ({
    label: one(labels, {
      fields: [labelsToGrammarPoints.labelId],
      references: [labels.id],
    }),
    grammarPoint: one(grammarPointsTmp, {
      fields: [labelsToGrammarPoints.grammarPointId],
      references: [grammarPointsTmp.id],
    }),
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
