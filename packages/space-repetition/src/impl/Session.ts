import { Seq } from "immutable";
import type { Session } from "../types/Session";
import type { Attempt } from "../types/Attempt";
import type { Stage } from "../types/Stage";

type Key = `${string}-${Stage}`;

const calculateResult = ({ attempts }: Session) => {
  const attemptsByGpStage = Seq(attempts).groupBy(
    (a) => `${a.grammarPointId}-${a.stage}` as Key,
  );

  const attemptsRate = attemptsByGpStage.map((gpAttempts) => {
    if (gpAttempts.every((a) => a.isCorrect)) {
      return true;
    }
    return false;
  });

  return {
    attempts: attemptsByGpStage.toJS() as { [x: string]: Attempt[] },
    correct: attemptsRate.filter((v) => v).size,
    total: attemptsRate.size,
  };
};

export default {
  calculateResult,
};
