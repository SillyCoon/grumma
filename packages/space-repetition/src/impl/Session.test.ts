import { describe, it, expect } from "vitest";
import Session from "./Session";
import { mockAttempt, mockSession } from "../../__mocks__";

describe("Session.calculateResult", () => {
  it("should return correct results when all attempts are correct", () => {
    const attempts11 = [
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: true }),
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: true }),
    ];

    const attempts21 = [
      mockAttempt({ grammarPointId: "2", stage: 1, isCorrect: true }),
    ];

    const session = mockSession([...attempts11, ...attempts21]);

    const result = Session.calculateResult(session);

    expect(result).toEqual({
      attempts: {
        "1-1": attempts11,
        "2-1": attempts21,
      },
      correct: 2,
      total: 2,
    });
  });

  it("should return correct results when some attempts are incorrect", () => {
    const session = mockSession([
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: true }),
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: false }),
      mockAttempt({ grammarPointId: "2", stage: 1, isCorrect: true }),
    ]);

    const result = Session.calculateResult(session);

    expect(result).toEqual({
      attempts: session.attempts,
      correct: 1,
      total: 2,
    });
  });

  it("should return correct results when all attempts are incorrect", () => {
    const session = mockSession([
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: false }),
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: true }),
      mockAttempt({ grammarPointId: "2", stage: 1, isCorrect: false }),
    ]);

    const result = Session.calculateResult(session);

    expect(result).toEqual({
      attempts: session.attempts,
      correct: 0,
      total: 2,
    });
  });

  it("should handle same grammar point different stages case", () => {
    const session = mockSession([
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: true }),
      mockAttempt({ grammarPointId: "1", stage: 2, isCorrect: false }),
      mockAttempt({ grammarPointId: "2", stage: 1, isCorrect: true }),
    ]);

    const result = Session.calculateResult(session);

    expect(result).toEqual({
      attempts: session.attempts,
      correct: 2,
      total: 3,
    });
  });
});
