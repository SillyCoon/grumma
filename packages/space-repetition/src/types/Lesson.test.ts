import type { GrammarPoint } from "grammar-sdk";
import { mockGrammarPoint } from "grammar-sdk/mocks";
import { expect, test } from "vitest";
import { Lesson } from "./Lesson";

test("Lesson", () => {
  const gp: GrammarPoint = mockGrammarPoint();
  // biome-ignore lint/correctness/noUnusedVariables: <test setup>
  const { exercises, ...noEx } = gp;

  const result = Lesson(gp);

  expect(result?.exercise.order).toBe(0);
  expect(result).toEqual({
    ...noEx,
    exercise: gp.exercises.at(0),
  });
});
