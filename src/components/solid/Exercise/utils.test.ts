import { describe, expect, it } from "vitest";
import { compareAnswer } from "./utils";

describe("compareAnswer", () => {
  it.each([
    ["пёс", "пес", true],
    ["пёс", "пёс", true],
    ["пес", "пёс", true],
    ["мама", "папа", false],
    ["трёхведёрный", "трёхведёрный", true],
  ])('compares "%s" with "%s" → %s', (correct, user, expected) => {
    expect(compareAnswer(correct, user)).toBe(expected);
  });
});
