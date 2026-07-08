import { Seq } from "immutable";
import type { Attempt, LocalAttempt } from "../types/Attempt";

type AttemptType<Local extends "local" | "remote"> = Local extends "local"
  ? LocalAttempt
  : Attempt;

export type Session<Local extends "local" | "remote" = "remote"> = {
  sessionId: string;
  attempts: AttemptType<Local>[];
};
export function Session<Local extends "local" | "remote" = "remote">(
  attempts: AttemptType<Local>[],
): Session<Local> {
  const sessionId = attempts.at(0)?.reviewSessionId;
  if (!sessionId || !attempts.every((a) => a.reviewSessionId === sessionId)) {
    throw new Error(
      "All attempts must have the same reviewSessionId and not be empty!",
    );
  }

  return {
    sessionId: sessionId,
    attempts,
  };
}

export type AnySessionResult = SessionResult<"local"> | SessionResult<"remote">;

export type SessionResult<Local extends "local" | "remote" = "remote"> = {
  sessionId: string;
  attempts: (Local extends "local" ? LocalAttempt : Attempt)[];
  correct: number;
  total: number;
};

export namespace Session {
  export const calculateResult = <Local extends "local" | "remote" = "remote">({
    attempts,
    sessionId,
  }: Session<Local>): SessionResult<Local> => {
    const attemptsByGpStage = Seq(attempts).groupBy(
      (a) => `${a.grammarPointId}-${a.stage}`,
    ) as Immutable.Map<string, Seq.Indexed<AttemptType<Local>>>;

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
        .filter((a): a is AttemptType<Local> => !!a)
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
