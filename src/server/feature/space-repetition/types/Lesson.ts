import type { GrammarPoint } from "@grammar-sdk";
import { Seq } from "immutable";

export type Lesson = Omit<GrammarPoint, "exercises"> & {
  exercise: GrammarPoint["exercises"][number];
};

export const Lesson = ({
  exercises,
  ...gp
}: GrammarPoint): Lesson | undefined => {
  const lastExercise = Seq(exercises).minBy((e) => e.order);
  if (!lastExercise) return undefined;
  return {
    ...gp,
    exercise: lastExercise,
  };
};
