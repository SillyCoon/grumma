import { z } from "astro/zod";

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
  parts: z.array(exercisePartSchema).min(2),
  order: z.number().int().positive(),
  hide: z.boolean(),
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExercisePart = Text | Answer;
