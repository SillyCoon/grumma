import { Seq } from "immutable";
import type { Attempt } from "./Attempt";

export type GrammarPointSession = {
  attempts: Attempt[];
  completedAt: Date;
  isCorrect: boolean;
  lastCorrect?: Attempt;
  lastIncorrect?: Attempt;
};

// TODO: Should be Session concept I think for entire user's learn try rather than this one
export const GrammarPointSession = (
  attempts: Attempt[],
): GrammarPointSession | undefined => {
  const completedAt = Seq(attempts).maxBy((a) => a.answeredAt)?.answeredAt;
  if (!completedAt) return undefined;

  return {
    attempts,
    completedAt,
    lastCorrect: Seq(attempts)
      .filter((a) => a.isCorrect)
      .maxBy((a) => a.answeredAt),
    lastIncorrect: Seq(attempts)
      .filter((a) => !a.isCorrect)
      .maxBy((a) => a.answeredAt),
    isCorrect: attempts.every((a) => a.isCorrect),
  };
};
