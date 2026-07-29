import { describe, expect, it } from "vitest";
import { compareAnswer, validAnswer } from "./utils";

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

describe("validAnswer", () => {
  it.each([
    "тест-ответ",
    "тест ответ",
    "тест",
  ])('validates "%s" as valid', (answer) => {
    expect(validAnswer(answer)).toBe(true);
  });

  it.each([
    "test",
    "тест!",
    "тест,",
    "тест.",
    "тест123",
    "тест_ответ",
  ])(// Invalid answers
  'validates "%s" as invalid', (answer) => {
    expect(validAnswer(answer)).toBe(false);
  });
});
