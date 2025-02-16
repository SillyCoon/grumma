import { describe, it, expect } from "vitest";
import { replaceAnswer } from "./Example";
import type { Example } from "../types/Example";

describe("replaceAnswer", () => {
  it("should replace the answer with the new answer", () => {
    const example: Example = ["привет", " мой ", "мир"];
    const newAnswer = "наш";
    const result = replaceAnswer(example, newAnswer);
    expect(result).toEqual(["привет", " наш ", "мир"]);
  });
});
