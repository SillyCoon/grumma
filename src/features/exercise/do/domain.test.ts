import { mockExercise } from "packages/grammar-sdk/__mocks__";
import { describe, expect, test } from "vitest";
import { checkAnswer } from "./domain";

const acceptableCorrect = {
  text: "собака",
  variant: "correct" as const,
  description: "This is another word for dog.",
};

const acceptableTryAgain = {
  text: "дог",
  variant: "try-again" as const,
  description: "You can't just write an English word in Russian",
};

const acceptableIncorrect = {
  text: "псина",
  variant: "incorrect" as const,
  description:
    "While technically correct, this is a slang word that could be offensive and not the one we are looking for.",
};

describe("checkAnswer", () => {
  test("returns null if the answer doesn't match any possible answers", () => {
    const exercise = mockExercise({
      parts: [
        { index: 0, type: "text", text: "a" },
        {
          index: 1,
          type: "answer",
          text: "пёс",
          acceptableAnswers: [
            acceptableCorrect,
            acceptableTryAgain,
            acceptableIncorrect,
          ],
        },
        { index: 2, type: "text", text: "b" },
      ],
    });

    const result = checkAnswer(exercise, "пос");
    expect(result).toBeNull();
  });

  test("matches the most correct if the answer is correct", () => {
    const exercise = mockExercise({
      parts: [
        { index: 0, type: "text", text: "a" },
        {
          index: 1,
          type: "answer",
          text: "пёс",
          acceptableAnswers: [
            acceptableCorrect,
            acceptableTryAgain,
            acceptableIncorrect,
          ],
        },
        { index: 2, type: "text", text: "b" },
      ],
    });

    const result = checkAnswer(exercise, "пёс");
    expect(result).toEqual({
      variant: "correct",
      text: "пёс",
    });
  });

  test("matches the most correct if there're no other acceptable answers", () => {
    const exercise = mockExercise({
      parts: [
        { index: 0, type: "text", text: "a" },
        {
          index: 1,
          type: "answer",
          text: "пёс",
        },
        { index: 2, type: "text", text: "b" },
      ],
    });

    const result = checkAnswer(exercise, "пёс");
    expect(result).toEqual({
      variant: "correct",
      text: "пёс",
    });
  });

  test.each([
    ["correct", "собака", acceptableCorrect],
    ["try-again", "дог", acceptableTryAgain],
    ["incorrect", "псина", acceptableIncorrect],
  ])("matches the %s acceptable answer", (_variant, input, expected) => {
    const exercise = mockExercise({
      parts: [
        { index: 0, type: "text", text: "a" },
        {
          index: 1,
          type: "answer",
          text: "пёс",
          acceptableAnswers: [
            acceptableCorrect,
            acceptableTryAgain,
            acceptableIncorrect,
          ],
        },
        { index: 2, type: "text", text: "b" },
      ],
    });

    const result = checkAnswer(exercise, input);
    expect(result).toEqual(expected);
  });

  test("matches the most correct even if there are same correct, incorrect and try again answers", () => {
    const answer = "пёс";
    const exercise = mockExercise({
      parts: [
        { index: 0, type: "text", text: "a" },
        {
          index: 1,
          type: "answer",
          text: "пёс",
          acceptableAnswers: [
            {
              text: "пес",
              variant: "correct" as const,
            },
            {
              text: answer,
              variant: "incorrect",
            },
            {
              text: answer,
              variant: "try-again" as const,
            },
          ],
        },
        { index: 2, type: "text", text: "b" },
      ],
    });

    const result = checkAnswer(exercise, answer);
    expect(result).toEqual({
      variant: "correct",
      text: answer,
    });
  });

  test("matches the correct even if there are same incorrect and try again answers", () => {
    const exercise = mockExercise({
      parts: [
        { index: 0, type: "text", text: "a" },
        {
          index: 1,
          type: "answer",
          text: "пёс",
          acceptableAnswers: [
            {
              text: "собака",
              variant: "correct" as const,
            },
            {
              text: "собака",
              variant: "incorrect",
            },
            {
              text: "собака",
              variant: "try-again" as const,
            },
          ],
        },
        { index: 2, type: "text", text: "b" },
      ],
    });

    const result = checkAnswer(exercise, "собака");
    expect(result).toEqual({
      variant: "correct",
      text: "собака",
    });
  });
  test("matches the try again even if there are same incorrect answers", () => {
    const exercise = mockExercise({
      parts: [
        { index: 0, type: "text", text: "a" },
        {
          index: 1,
          type: "answer",
          text: "пёс",
          acceptableAnswers: [
            {
              text: "собака",
              variant: "try-again" as const,
            },
            {
              text: "собака",
              variant: "incorrect",
            },
          ],
        },
        { index: 2, type: "text", text: "b" },
      ],
    });

    const result = checkAnswer(exercise, "собака");
    expect(result).toEqual({
      variant: "try-again",
      text: "собака",
    });
  });
});
