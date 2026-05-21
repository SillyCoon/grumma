import { describe, expect, test } from "vitest";
import type { ExercisePart } from ".";
import { ExerciseDb } from "./dto";

const mockDbPart = (
  overrides?: Partial<ExerciseDb["parts"][number]>,
): ExerciseDb["parts"][number] => {
  return {
    id: 1,
    exerciseId: 1,
    order: 0,
    type: "answer",
    text: "Answer part",
    acceptableAnswers: [],
    language: "ru",
    description: "",
    updatedAt: new Date(),
    createdAt: new Date(),
    ...overrides,
  };
};

describe("Exercise DTO", () => {
  test("pads exercise parts with empty text if there are less than 3 parts and the answer is the first part", () => {
    const exercise: ExerciseDb = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      grammarPointId: 1,
      order: 0,
      hide: false,
      parts: [
        mockDbPart({
          order: 0,
          language: "ru",
          type: "answer",
          text: "Answer",
        }),
        mockDbPart({ order: 1, language: "ru", type: "text", text: "Right" }),
        mockDbPart({
          order: 0,
          language: "en",
          type: "answer",
          text: "Answer",
        }),
        mockDbPart({ order: 1, language: "en", type: "text", text: "Right" }),
      ],
    };

    const result = ExerciseDb.toExercise(exercise);

    expect(result.parts).toEqual([
      expect.objectContaining({
        index: 0,
        type: "text",
        text: "",
      }),
      expect.objectContaining({
        index: 1,
        type: "answer",
        text: "Answer",
      }),
      expect.objectContaining({
        index: 2,
        type: "text",
        text: "Right",
      }),
    ] as ExercisePart[]);
  });

  test("pads exercise parts with empty text if there are less than 3 parts and the answer is the last part", () => {
    const exercise: ExerciseDb = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      grammarPointId: 1,
      order: 0,
      hide: false,
      parts: [
        mockDbPart({ order: 0, language: "ru", type: "text", text: "Left" }),
        mockDbPart({
          order: 1,
          language: "ru",
          type: "answer",
          text: "Answer",
        }),

        mockDbPart({ order: 0, language: "en", type: "text", text: "Left" }),
        mockDbPart({
          order: 1,
          language: "en",
          type: "answer",
          text: "Answer",
        }),
      ],
    };

    const result = ExerciseDb.toExercise(exercise);

    expect(result.parts).toEqual([
      expect.objectContaining({
        index: 0,
        type: "text",
        text: "Left",
      }),
      expect.objectContaining({
        index: 1,
        type: "answer",
        text: "Answer",
      }),
      expect.objectContaining({
        index: 2,
        type: "text",
        text: "",
      }),
    ] as ExercisePart[]);
  });

  test("does not pad exercise parts if there are already 3 parts", () => {
    const exercise: ExerciseDb = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      grammarPointId: 1,
      order: 0,
      hide: false,
      parts: [
        mockDbPart({ order: 0, language: "ru", type: "text", text: "Left" }),
        mockDbPart({
          order: 1,
          language: "ru",
          type: "answer",
          text: "Answer",
        }),
        mockDbPart({ order: 2, language: "ru", type: "text", text: "Right" }),
        mockDbPart({ order: 0, language: "en", type: "text", text: "Left" }),
        mockDbPart({
          order: 1,
          language: "en",
          type: "answer",
          text: "Answer",
        }),
        mockDbPart({ order: 2, language: "en", type: "text", text: "Right" }),
      ],
    };

    const result = ExerciseDb.toExercise(exercise);

    expect(result.parts).toEqual([
      expect.objectContaining({
        index: 0,
        type: "text",
        text: "Left",
      }),
      expect.objectContaining({
        index: 1,
        type: "answer",
        text: "Answer",
      }),
      expect.objectContaining({
        index: 2,
        type: "text",
        text: "Right",
      }),
    ] as ExercisePart[]);
  });
});
