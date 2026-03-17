import { z } from "astro/zod";
import { Context } from "../context";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <expected>
import { Set } from "immutable";
import { err, ok } from "neverthrow";

export const textSchema = z.object({
  id: z.number().int().positive().optional(),
  index: z.number(),
  type: z.literal("text"),
  text: z.string().min(1, "Text cannot be empty"),
});
export type Text = z.infer<typeof textSchema>;
export const Text = (index: number, text: string): Text => ({
  index,
  type: "text",
  text,
});

export const acceptableAnswerSchema = z.object({
  id: z.number().int().positive().optional(),
  text: z.string().min(1, "Acceptable answer cannot be empty"),
  description: z.string().optional(),
  variant: z.enum(["correct", "incorrect", "try-again"]),
});
export type AcceptableAnswer = z.infer<typeof acceptableAnswerSchema>;

export const answerSchema = z.object({
  id: z.number().int().positive().optional(),
  index: z.number(),
  type: z.literal("answer"),
  text: z.string().min(1, "Answer cannot be empty"),
  description: z.string().optional(),
  acceptableAnswers: z.array(acceptableAnswerSchema).optional(),
});
export type Answer = z.infer<typeof answerSchema>;
export const Answer = (index: number, text: string): Answer => ({
  type: "answer",
  text,
  index,
  acceptableAnswers: [],
});

const exercisePartSchema = z.discriminatedUnion("type", [
  textSchema,
  answerSchema,
]);

export const exerciseSchema = z.object({
  id: z.number().int().positive().optional(),
  grammarPointId: z.string(),
  parts: z.array(exercisePartSchema).min(2),
  translationParts: z.array(exercisePartSchema).min(2),
  order: z.number().int().positive().or(z.literal(0)),
  hide: z.boolean(),
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExercisePart = Text | Answer;

export const Exercise = {
  isVisible(exercise: Exercise, context: Context) {
    return !exercise.hide || Context.isAdmin(context);
  },
};

export type UpdateExercise = Exercise & { id: number };

export const Exercises = {
  filterVisible(exercises: Exercise[], context: Context) {
    return exercises.filter((ex) => Exercise.isVisible(ex, context));
  },
  validate(exercises: Exercise[], existingExercises: Exercise[]) {
    const newIds = Set(exercises.map((e) => e.grammarPointId));
    if (newIds.size > 1) {
      return err("All exercises must belong to the same grammar point.");
    }
    const existingOrders = Set<number>(existingExercises.map((ex) => ex.order));
    const newOrders = Set<number>(exercises.map((ex) => ex.order));
    if (existingOrders.intersect(newOrders).size !== newOrders.size) {
      return err(
        "Order values must be unique and cannot conflict with existing exercises.",
      );
    }
    return ok(true);
  },
  splitToCreateAndUpdate(
    exercises: Exercise[],
    existingExercises: Exercise[],
  ): { toCreate: Exercise[]; toUpdate: UpdateExercise[] } {
    const existingIds = Set<number>(
      existingExercises.map((ex) => ex.id).filter((id): id is number => !!id),
    );
    const toCreate: Exercise[] = [];
    const toUpdate: UpdateExercise[] = [];
    for (const exercise of exercises) {
      if (exercise.id && existingIds.has(exercise.id)) {
        toUpdate.push(exercise as UpdateExercise);
      } else {
        toCreate.push(exercise);
      }
    }
    return { toCreate, toUpdate };
  },
};
