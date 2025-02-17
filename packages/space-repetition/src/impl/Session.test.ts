import { describe, expect, it } from "vitest";
import { mockAttempt, mockSession } from "../../__mocks__";
import Session from "./Session";

describe("Session.calculateResult", () => {
  it("should return correct results when all attempts are correct", () => {
    const attempts11 = [
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: true }),
    ];

    const attempts21 = [
      mockAttempt({ grammarPointId: "2", stage: 1, isCorrect: true }),
    ];

    const session = mockSession([...attempts11, ...attempts21]);

    const result = Session.calculateResult(session);

    expect(result).toEqual({
      sessionId: session.sessionId,
      attempts: [...attempts11, ...attempts21],
      correct: 2,
      total: 2,
    });
  });

  it("should return correct results when some attempts are incorrect", () => {
    const latest = new Date("2020-10-10");
    const before = new Date("2020-10-09");
    const beforeBefore = new Date("2020-10-08");

    const attempt11 = mockAttempt({
      grammarPointId: "1",
      stage: 1,
      isCorrect: false,
      answeredAt: before,
    });

    const attempt21 = mockAttempt({
      grammarPointId: "2",
      stage: 1,
      isCorrect: true,
    });

    const session = mockSession([
      mockAttempt({
        grammarPointId: "1",
        stage: 1,
        isCorrect: true,
        answeredAt: latest,
      }),
      mockAttempt({
        grammarPointId: "1",
        stage: 1,
        isCorrect: false,
        answeredAt: beforeBefore,
      }),
      attempt11,
      attempt21,
    ]);

    const result = Session.calculateResult(session);

    expect(result).toEqual({
      sessionId: session.sessionId,
      attempts: [attempt11, attempt21],
      correct: 1,
      total: 2,
    });
  });

  it("should return correct results when all attempts are incorrect", () => {
    const attempt11 = mockAttempt({
      grammarPointId: "1",
      stage: 1,
      isCorrect: false,
    });
    const attempt21 = mockAttempt({
      grammarPointId: "2",
      stage: 1,
      isCorrect: false,
    });

    const session = mockSession([
      mockAttempt({ grammarPointId: "1", stage: 1, isCorrect: true }),
      attempt11,
      attempt21,
    ]);

    const result = Session.calculateResult(session);

    expect(result).toEqual({
      sessionId: session.sessionId,
      attempts: [attempt11, attempt21],
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
      sessionId: session.sessionId,
      attempts: session.attempts,
      correct: 2,
      total: 3,
    });
  });
});
