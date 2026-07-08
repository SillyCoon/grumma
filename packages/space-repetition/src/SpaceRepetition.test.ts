import { describe, expect, test } from "vitest";
import { calculateExerciseOrderByStage } from "./SpaceRepetition";
import type { Stage } from "./types/Stage";

describe("calculateNextExerciseOrder", () => {
  test.each([
    [3, 0, 0],
    [3, 1, 1],
    [3, 2, 2],
    [3, 3, 0],
    [3, 4, 1],
    [3, 5, 2],
    [3, 6, 0],
    [3, 7, 1],
    [3, 8, 2],
    [5, 0, 0],
    [5, 1, 1],
    [5, 2, 2],
    [5, 3, 3],
    [5, 4, 4],
    [5, 5, 0],
    [5, 6, 1],
    [5, 7, 2],
    [5, 8, 3],
    [5, 9, 4],
    [5, 10, 0],
  ])("returns correct exercise order for exercisesNumber=%i and stage=%i", (exercisesNumber: number, stage: number, expected: number) => {
    expect(calculateExerciseOrderByStage(exercisesNumber, stage as Stage)).toBe(
      expected,
    );
  });
});
