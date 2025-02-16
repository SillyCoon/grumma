import type { Attempt } from "./Attempt";

export type Session = {
  sessionId: string;
  attempts: Attempt[];
};
export const Session = (attempts: Attempt[]): Session => {
  const sessionId = attempts.at(0)?.reviewSessionId;
  if (!sessionId || !attempts.every((a) => a.reviewSessionId === sessionId)) {
    throw new Error("All attempts must have the same reviewSessionId");
  }

  return {
    sessionId: sessionId,
    attempts,
  };
};
export type SessionResult = {
  attempts: Attempt[];
  correct: number;
  total: number;
};
