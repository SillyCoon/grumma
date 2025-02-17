import { Seq } from "immutable";
import type { Attempt } from "../types/Attempt";
import type { Session, SessionResult } from "../types/Session";
import type { Stage } from "../types/Stage";

type Key = `${string}-${Stage}`;

const calculateResult = ({ attempts, sessionId }: Session): SessionResult => {
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

export default {
  calculateResult,
};
