import type { ExercisePart } from "../exercise";

export type Example = [string, string, string];

export const Example = {
  fromExerciseParts: (exerciseParts: ExercisePart[]): Example => {
    const parts = exerciseParts.map((part) => part.text);
    if (parts.length < 3) {
      parts.push(...new Array(3 - parts.length).fill(""));
    }
    return parts as Example;
  },
  replaceAnswer: ([a, answer, b]: Example, newAnswer: string): Example => {
    return [a, answer.replaceAll(/\p{L}+/gu, newAnswer), b];
  },
};
