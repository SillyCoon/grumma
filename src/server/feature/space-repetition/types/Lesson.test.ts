import type { GrammarPoint } from "grammar-sdk";
import { mockGrammarPoint } from "src/__mocks__";
import { test, expect } from "vitest";
import { Lesson } from "./Lesson";

test("Lesson", () => {
  const gp: GrammarPoint = mockGrammarPoint();
  const { exercises, ...noEx } = gp;

  const result = Lesson(gp);

  expect(result?.exercise.order).toBe(0);
  expect(result).toEqual({
    ...noEx,
    exercise: gp.exercises.at(0),
  });
});
