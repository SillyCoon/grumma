import type { Exercise, AcceptableAnswer } from "grammar-sdk";
import { compareAnswer } from "./utils";

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
): AcceptableAnswer | null => {
  const answers = getAllPossibleAnswers(exercise);
  const matchedAnswers = answers.filter((a) => compareAnswer(a.text, answer));
  if (!matchedAnswers.length) return null;

  if (matchedAnswers.length > 1) {
    console.warn(
      "Multiple possible answers matched for exercise, this should not happen",
      exercise,
      matchedAnswers,
    );

    const priority = ["correct", "try-again", "incorrect"];
    matchedAnswers.sort(
      (a, b) => priority.indexOf(a.variant) - priority.indexOf(b.variant),
    );
  }

  return matchedAnswers[0];
};
