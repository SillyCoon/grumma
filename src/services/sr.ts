import { actions } from "astro:actions";
import toast from "solid-toast";
import type { Attempt } from "space-repetition";

export const saveAttempt = async (attempt: Attempt) => {
  const result = await actions.saveAttempt(attempt);
  if (result.error) {
    toast.error("Couldn't save attempt, please try again later");
  }
};
