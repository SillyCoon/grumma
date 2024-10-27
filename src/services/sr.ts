import type { Attempt } from "src/server/feature/space-repetition/types/Attempt";
import type { Lesson } from "src/server/feature/space-repetition/types/Lesson";

export const saveAttempt = async (attempt: Attempt) => {
	await fetch("/api/sr/attempt", {
		method: "POST",
		body: JSON.stringify(attempt),
	});
};

export const getReviews = async () => {
	const response = await fetch("/api/sr/review", { method: "GET" });
	return response.json() as Promise<Lesson[]>;
};
