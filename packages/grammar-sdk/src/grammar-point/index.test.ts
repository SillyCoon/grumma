import {
  mockExercise,
  mockFullExample,
  mockGrammarPoint,
} from "../../__mocks__";
import { GrammarPoints } from ".";
import { describe, expect, test } from "vitest";

describe("GrammarPoint", () => {
  test("filters hidden for non-admin", () => {
    const grammarPoints = [
      mockGrammarPoint({ order: 1, hide: false }),
      mockGrammarPoint({ order: 2, hide: true }),
      mockGrammarPoint({ order: 3, hide: false }),
      mockGrammarPoint({ order: 4, hide: true }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "guest" },
    });
    expect(result).toEqual([grammarPoints[0], grammarPoints[2]]);
  });

  test("does not filter hidden for admin", () => {
    const grammarPoints = [
      mockGrammarPoint({ order: 1, hide: false }),
      mockGrammarPoint({ order: 2, hide: true }),
      mockGrammarPoint({ order: 3, hide: false }),
      mockGrammarPoint({ order: 4, hide: true }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "admin" },
    });
    expect(result).toEqual(grammarPoints);
  });

  test("filters hidden exercises for non-admin", () => {
    const grammarPoints = [
      mockGrammarPoint({
        order: 1,
        hide: false,
        exercises: [
          mockExercise({ hide: false }),
          mockExercise({ hide: false }),
          mockExercise({ hide: true }),
          mockExercise({ hide: false }),
          mockExercise({ hide: true }),
        ],
      }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "guest" },
    });
    expect(result).toEqual([
      expect.objectContaining({
        exercises: [
          expect.objectContaining({ hide: false }),
          expect.objectContaining({ hide: false }),
          expect.objectContaining({ hide: false }),
        ],
      }),
    ]);
  });

  test("does not filter hidden exercises for admin", () => {
    const grammarPoints = [
      mockGrammarPoint({
        order: 1,
        hide: false,
        exercises: [
          mockExercise({ hide: false }),
          mockExercise({ hide: false }),
          mockExercise({ hide: true }),
          mockExercise({ hide: false }),
          mockExercise({ hide: true }),
        ],
      }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "admin" },
    });
    expect(result).toEqual(grammarPoints);
  });

  test("filters hidden examples for non-admin", () => {
    const grammarPoints = [
      mockGrammarPoint({
        order: 1,
        hide: false,
        examples: [
          mockFullExample({ hide: false }),
          mockFullExample({ hide: false }),
          mockFullExample({ hide: true }),
          mockFullExample({ hide: false }),
          mockFullExample({ hide: true }),
        ],
      }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "guest" },
    });
    expect(result).toEqual([
      expect.objectContaining({
        examples: [
          expect.objectContaining({ hide: false }),
          expect.objectContaining({ hide: false }),
          expect.objectContaining({ hide: false }),
        ],
      }),
    ]);
  });

  test("does not filter hidden examples for admin", () => {
    const grammarPoints = [
      mockGrammarPoint({
        order: 1,
        hide: false,
        examples: [
          mockFullExample({ hide: false }),
          mockFullExample({ hide: false }),
          mockFullExample({ hide: true }),
          mockFullExample({ hide: false }),
          mockFullExample({ hide: true }),
        ],
      }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "admin" },
    });
    expect(result).toEqual(grammarPoints);
  });
});
