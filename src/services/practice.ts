import type { LocalAttempt } from "space-repetition";
import { Session } from "space-repetition/session";

const getAttemptsFromSessionStorage = (): LocalAttempt[] => {
  const maybeAttempts = globalThis?.sessionStorage?.getItem?.("practice");
  return maybeAttempts ? JSON.parse(maybeAttempts) : [];
};

export const saveAttemptToSessionStorage = (attempt: LocalAttempt) => {
  const oldAttempts = getAttemptsFromSessionStorage();
  sessionStorage.setItem("practice", JSON.stringify([...oldAttempts, attempt]));
};

export const getLocalSessionResults = () => {
  const attempts = getAttemptsFromSessionStorage();
  const session = attempts.length ? Session<"local">(attempts) : undefined;
  return session && Session.calculateResult(session);
};
