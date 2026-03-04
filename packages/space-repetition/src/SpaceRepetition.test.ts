import { describe, expect, test, vi } from "vitest";
import {
  calculateExerciseOrderByStage,
  SpaceRepetition,
} from "./SpaceRepetition";
import type { Stage } from "./types/Stage";
import type { RepetitionAlgorithm } from "./SpaceRepetition";
import { mockGrammarPoint } from "grammar-sdk/mocks";
import type { GrammarPoint } from "grammar-sdk";

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

describe("nextRound", () => {
  test("loops to first exercise when stage exceeds number of exercises", () => {
    const mockAlgorithm: RepetitionAlgorithm = {
      getSchedule: vi.fn().mockReturnValue([
        {
          grammarPointId: "gp1",
          stage: 4,
          availableAt: new Date(0),
        },
      ]),
    };

    const settings = {
      stageMinutes: { 0: 1, 1: 10, 2: 60, 3: 1440, 4: 10080 } as Record<
        Stage,
        number
      >,
      stageDowngradeMultiplier: 2,
    };

    const gp = mockGrammarPoint({ id: "gp1" });
    const grammarPoints: GrammarPoint[] = [
      {
        ...gp,
        exercises: [
          {
            hide: false,
            grammarPointId: "gp1",
            parts: [],
            translationParts: [],
            order: 0,
          },
          {
            hide: false,
            grammarPointId: "gp1",
            parts: [],
            translationParts: [],
            order: 1,
          },
          {
            hide: false,
            grammarPointId: "gp1",
            parts: [],
            translationParts: [],
            order: 2,
          },
          {
            hide: false,
            grammarPointId: "gp1",
            parts: [],
            translationParts: [],
            order: 3,
          },
        ],
      },
    ];

    const sr = SpaceRepetition([]);
    const result = sr.nextRound(mockAlgorithm, settings, grammarPoints);

    expect(result).toHaveLength(1);
    expect(result[0].exercise.order).toBe(0);
    expect(result[0].stage).toBe(4);
  });
});
