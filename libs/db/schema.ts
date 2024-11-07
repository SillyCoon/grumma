import { relations } from "drizzle-orm";
import { integer, pgSchema, text } from "drizzle-orm/pg-core";

export const grumma = pgSchema("grumma");

export const grammarPoints = grumma.table("grammar_point", {
	id: integer("id").primaryKey(),
	order: integer(),
	structure: text(),
	title: text().notNull().unique(),
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
