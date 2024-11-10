import { actions } from "astro:actions";
import type { Attempt } from "src/server/feature/space-repetition/types/Attempt";
import type { Lesson } from "src/server/feature/space-repetition/types/Lesson";
import toast from "solid-toast";

export const saveAttempt = async (attempt: Attempt) => {
	const result = await actions.saveAttempt(attempt);
	if (result.error) {
		toast.error("Couldn't save attempt, please try again later");
	}
};

export const getReviews = async () => {
	const response = await fetch("/api/sr/review", { method: "GET" });
	return response.json() as Promise<Lesson[]>;
};
