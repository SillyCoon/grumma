import type { Attempt } from "space-repetition";
import { Session } from "space-repetition/session";

const getAttemptsFromSessionStorage = (): Attempt[] => {
  const maybeAttempts = globalThis?.sessionStorage?.getItem?.("practice");
  return maybeAttempts ? JSON.parse(maybeAttempts) : [];
};

export const saveAttemptToSessionStorage = (attempt: Attempt) => {
  const oldAttempts = getAttemptsFromSessionStorage();
  sessionStorage.setItem("practice", JSON.stringify([...oldAttempts, attempt]));
};

export const getPracticeSessionResults = () => {
  const attempts = getAttemptsFromSessionStorage();
  const session = attempts.length ? Session(attempts) : undefined;
  return session && Session.calculateResult(session);
};
