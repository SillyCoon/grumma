import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgSchema,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const grumma = pgSchema("grumma");

export const grammarPoints = grumma.table("grammar_point", {
	id: integer("id").primaryKey(),
	order: integer(),
	structure: text(),
	title: text().notNull().unique(),
	torfl: varchar({ length: 2 }).default("A1").notNull(),
});

export const exercises = grumma.table("exercise", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	grammarPointId: integer()
		.notNull()
		.references(() => grammarPoints.id),
	order: integer().notNull(),
	ru: text().notNull(),
	en: text().notNull(),
	helper: text(),
});

export const grammarPointRelations = relations(grammarPoints, ({ many }) => ({
	exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
	grammarPointId: one(grammarPoints, {
		fields: [exercises.grammarPointId],
		references: [grammarPoints.id],
	}),
}));

export const spaceRepetitions = grumma.table("space_repetition", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	answer: text(),
	answeredAt: timestamp().notNull(),
	grammarPointId: integer()
		.notNull()
		.references(() => grammarPoints.id),
	isCorrect: boolean().notNull(),
	reviewSessionId: uuid().notNull(),
	stage: integer().notNull(),
	userId: text().notNull(),
});
