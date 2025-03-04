import { actions } from "astro:actions";
import toast from "solid-toast";
import type { Attempt } from "space-repetition";
import { saveAttemptToSessionStorage } from "./practice";

export const clearPracticeSession = () => {
  globalThis?.sessionStorage?.removeItem?.("practice");
};

export const saveAttempt = async (attempt: Attempt) => {
  if (attempt.reviewSessionId === "practice") {
    return saveAttemptToSessionStorage(attempt);
  }
  const result = await actions.saveAttempt(attempt);
  if (result.error) {
    toast.error("Couldn't save attempt, please try again later");
  }
};
