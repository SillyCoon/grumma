import { mockExercises, mockGrammarPoint } from "grammar-sdk/mocks";
import { expect, test } from "vitest";
import { Lesson } from "./Lesson";

test("Lesson", () => {
  const gp = mockGrammarPoint();

  const exercises = mockExercises(12, gp.id);

  const result = Lesson({ ...gp, exercises });

  expect(result?.exercise.order).toBe(0);
  expect(result).toEqual({
    ...gp,
    exercise: exercises.at(0),
  });
});
