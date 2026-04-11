import { describe, expect, test } from "vitest";
import { Exercises, type UpdateExercise } from ".";
import { mockExercise } from "../../__mocks__";
import { err } from "neverthrow";

describe("Exercise", () => {
  describe("validate", () => {
    test("should return error if exercises belong to different grammar points", () => {
      const updatingOrCreating = [
        mockExercise({ grammarPointId: "1" }),
        mockExercise({ grammarPointId: "2" }),
      ];
      const result = Exercises.validate(updatingOrCreating);
      expect(result).toEqual(
        err("All exercises must belong to the same grammar point."),
      );
    });
    test("should return error if exercise order values are not unique", () => {
      const updatingOrCreating = [
        mockExercise({ grammarPointId: "1", order: 1 }),
        mockExercise({ grammarPointId: "1", order: 1 }),
      ];
      const result = Exercises.validate(updatingOrCreating);
      expect(result).toEqual(err("Exercise order values must be unique."));
    });
  });
  describe("validateUpdate", () => {
    test("should return error if update includes more exercises than existing", () => {
      const existingExercises = [mockExercise({ id: 1 })];
      const updating = [
        mockExercise({ id: 1 }),
        mockExercise({ id: 2 }),
      ] as UpdateExercise[];
      const result = Exercises.validateUpdate(updating, existingExercises);
      expect(result).toEqual(
        err("Partial exercises updates are not supported yet."),
      );
    });
    test("should return error if update includes fewer exercises than existing", () => {
      const existingExercises = [
        mockExercise({ id: 1 }),
        mockExercise({ id: 2 }),
      ];
      const updating = [mockExercise({ id: 1 })] as UpdateExercise[];
      const result = Exercises.validateUpdate(updating, existingExercises);
      expect(result).toEqual(
        err("Partial exercises updates are not supported yet."),
      );
    });
  });
  describe("filterVisible", () => {
    test("should filter out hidden exercises for user context", () => {
      const exercises = [
        mockExercise({ id: 1, hide: true }),
        mockExercise({ id: 2, hide: false }),
      ];
      const result = Exercises.filterVisible(exercises, {
        user: { role: "user" },
      });
      expect(result).toEqual([exercises[1]]);
    });
    test("should filter out hidden exercises for guest context", () => {
      const exercises = [
        mockExercise({ id: 1, hide: true }),
        mockExercise({ id: 2, hide: false }),
      ];
      const result = Exercises.filterVisible(exercises, {
        user: { role: "guest" },
      });
      expect(result).toEqual([exercises[1]]);
    });
    test("should not filter out hidden exercises for admin context", () => {
      const exercises = [
        mockExercise({ id: 1, hide: true }),
        mockExercise({ id: 2, hide: false }),
      ];
      const result = Exercises.filterVisible(exercises, {
        user: { role: "admin" },
      });
      expect(result).toEqual(exercises);
    });
  });
});
