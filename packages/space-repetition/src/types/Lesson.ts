import type { Exercise, GrammarPoint } from "grammar-sdk";
import { Seq } from "immutable";

export type Lesson = GrammarPoint & {
  exercise: Exercise;
};

export const Lesson = ({
  exercises,
  ...gp
}: GrammarPoint & {
  exercises: Exercise[];
}): Lesson | undefined => {
  const firstExercise = Seq(exercises).minBy((e) => e.order);
  if (!firstExercise) return undefined;
  return {
    ...gp,
    exercise: firstExercise,
  };
};
