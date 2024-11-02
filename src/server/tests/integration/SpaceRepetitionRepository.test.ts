import { beforeEach, describe, expect, test } from "vitest";
import {
	addToRepetitions,
	getAttempts,
	removeFromRepetitions,
	saveAttempt,
} from "../../feature/space-repetition/SpaceRepetitionRepository";
import type { Attempt } from "../../feature/space-repetition/types/Attempt";
import { v4 as uuid } from "uuid";
import { firestore, timestampToDate } from "src/server/firestore";

const mockAttempt = (grammarPointId: string): Attempt => {
	return {
		grammarPointId,
		stage: 1,
		answer: "added manually",
		isCorrect: true,
		answeredAt: new Date(),
		reviewSessionId: uuid(),
	};
};

describe("SpaceRepetitionRepository", () => {
	beforeEach(async () => {
		const query = firestore.collection("sr").where("userId", "in", ["1", "2"]);
		const batch = firestore.batch();
		const snapshot = await query.get();
		snapshot.docs.forEach((doc) => batch.delete(doc.ref));
		await batch.commit();
	});

	test("saveAttempt", async () => {
		const user = { id: "1" };
		const grammarPointId = "1";

		const attempt: Attempt = {
			grammarPointId,
			stage: 1,
			answer: "added manually",
			isCorrect: true,
			answeredAt: new Date(),
			reviewSessionId: uuid(),
		};

		await saveAttempt(attempt, user);

		const result = await firestore
			.collection("sr")
			.where("userId", "==", user.id)
			.where("grammarPointId", "==", grammarPointId)
			.get();

		expect(result.size).toEqual(1);

		const doc = result.docs[0].data();
		const attemptWithoutDate = attempt;

		expect({ ...doc, answeredAt: timestampToDate(doc.answeredAt) }).toEqual({
			...attemptWithoutDate,
			userId: user.id,
		});
	});

	test("getAttempts", async () => {
		const otherUserAttempt = mockAttempt("2");
		await saveAttempt(otherUserAttempt, { id: "2" });

		const user = { id: "1" };
		const grammarPointId = "1";

		const attempt: Attempt = {
			grammarPointId,
			stage: 1,
			answer: "added manually",
			isCorrect: true,
			answeredAt: new Date(),
			reviewSessionId: uuid(),
		};

		await saveAttempt(attempt, user);

		const result = await getAttempts(user);

		expect(result).toEqual([{ ...attempt, userId: user.id }]);
	});

	test("removeFromRepetitions", async () => {
		const otherUserAttempt = mockAttempt("2");
		await saveAttempt(otherUserAttempt, { id: "2" });

		const user = { id: "1" };
		const grammarPointId = "1";

		const attempt: Attempt = {
			grammarPointId,
			stage: 1,
			answer: "added manually",
			isCorrect: true,
			answeredAt: new Date(),
			reviewSessionId: uuid(),
		};

		await saveAttempt(attempt, user);

		await removeFromRepetitions(user, grammarPointId);

		const result = await getAttempts(user);

		expect(result).toEqual([]);

		const otherUserResult = await getAttempts({ id: "2" });

		expect(otherUserResult).toEqual([{ ...otherUserAttempt, userId: "2" }]);
	});

	test("addToRepetitions", async () => {
		const user = { id: "1" };
		const grammarPointId = "1";
		const addedAt = new Date();

		await addToRepetitions(user, grammarPointId, addedAt);

		const result = await getAttempts(user);

		expect(result).toEqual([
			{
				grammarPointId,
				stage: 0,
				answer: "added manually",
				answeredAt: addedAt,
				isCorrect: true,
				reviewSessionId: expect.any(String),
				userId: user.id,
			},
		]);
	});
});
