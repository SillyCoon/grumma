import type { Exercise } from "packages/grammar-sdk";
import type { Answer } from "packages/grammar-sdk/src/exercise";
import { compareAnswer } from "./utils";

type PossibleAnswer = {
  text: string;
  variant: "correct" | "incorrect" | "try-again";
  description?: string;
};

const getAllPossibleAnswers = (exercise: Exercise) => {
  const possibleAnswers = exercise.parts.find((v) => v.type === "answer");

  if (!possibleAnswers) {
    console.error("No possible answers found for exercise", exercise);
    return [];
  }

  const mostCorrect = {
    text: possibleAnswers.text,
    variant: "correct" as const,
    description: possibleAnswers.description,
  };

  return [mostCorrect, ...(possibleAnswers.acceptableAnswers ?? [])];
};

export const checkAnswer = (
  exercise: Exercise,
  answer: string,
): PossibleAnswer | null => {
  const answers = getAllPossibleAnswers(exercise);
  const matchedAnswers = answers.filter((a) => compareAnswer(a.text, answer));
  if (!matchedAnswers.length) return null;

  if (matchedAnswers.length > 1) {
    console.warn(
      "Multiple possible answers matched for exercise, this should not happen",
      exercise,
      matchedAnswers,
    );
  }

  return matchedAnswers[0];
};
