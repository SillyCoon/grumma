import { actions } from "astro:actions";
import toast from "solid-toast";
import type { Attempt, Stage } from "space-repetition";
import { saveAttemptToSessionStorage } from "./practice";

export const clearPracticeSession = () => {
  globalThis?.sessionStorage?.removeItem?.("practice");
};

export const saveAttempt = async (
  attempt: Attempt & { exerciseOrder: number },
) => {
  const { exerciseOrder, ...rest } = attempt;
  if (attempt.reviewSessionId === "practice") {
    return saveAttemptToSessionStorage({
      ...rest,
      // TODO: temporary workaround to fix session results, we should save exercise order in DB as well
      // since stage is not 1-1 map with exercise order anymore
      stage: exerciseOrder as Stage,
    });
  }
  const result = await actions.saveAttempt(rest);
  if (result.error) {
    toast.error("Couldn't save attempt, please try again later");
  }
};
