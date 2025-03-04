import { Seq } from "immutable";
import type { Attempt } from "../types/Attempt";
import type { Stage } from "../types/Stage";

export type Session = {
  sessionId: string;
  attempts: Attempt[];
};
export function Session(attempts: Attempt[]): Session {
  const sessionId = attempts.at(0)?.reviewSessionId;
  if (!sessionId || !attempts.every((a) => a.reviewSessionId === sessionId)) {
    throw new Error("All attempts must have the same reviewSessionId");
  }

  return {
    sessionId: sessionId,
    attempts,
  };
}

export type SessionResult = {
  sessionId: string;
  attempts: Attempt[];
  correct: number;
  total: number;
};

type Key = `${string}-${Stage}`;

export namespace Session {
  export const calculateResult = ({
    attempts,
    sessionId,
  }: Session): SessionResult => {
    const attemptsByGpStage = Seq(attempts).groupBy(
      (a) => `${a.grammarPointId}-${a.stage}` as Key,
    );

    const meaningfulAttempts = Array.from(
      attemptsByGpStage
        .map((gpAttempts) => {
          if (gpAttempts.every((a) => a.isCorrect)) {
            return gpAttempts.first();
          }
          return gpAttempts
            .filter((a) => !a.isCorrect)
            .sort((a, b) => +a.answeredAt - +b.answeredAt)
            .last();
        })
        .filter((a): a is Attempt => !!a)
        .values(),
    );

    return {
      sessionId: sessionId,
      attempts: meaningfulAttempts,
      correct: meaningfulAttempts.filter((v) => v.isCorrect).length,
      total: meaningfulAttempts.length,
    };
  };
}
