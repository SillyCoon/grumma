import type { User } from "../../../models/user";
import type { Attempt } from "./types/Attempt";
import { v4 as uuid } from "uuid";
import type { Stage } from "./types/Stage";
import { firestore, timestampToDate } from "src/server/firestore";

export const getAttempts = async (user: User): Promise<Attempt[]> => {
	const tries = await firestore
		.collection("sr")
		.where("userId", "==", user.id)
		.get();
	return tries.docs
		.map((d) => d.data() as Attempt)
		.map((a) => ({ ...a, answeredAt: timestampToDate(a.answeredAt) }));
};

export const saveAttempt = async (
	attempt: Attempt,
	user: User,
): Promise<void> => {
	await firestore.collection("sr").add({ ...attempt, userId: user.id });
};

export const removeFromRepetitions = async (
	user: User,
	grammarPointId: string,
) => {
	const query = firestore
		.collection("sr")
		.where("grammarPointId", "==", grammarPointId)
		.where("userId", "==", user.id);
	const batch = firestore.batch();
	const snapshot = await query.get();
	snapshot.docs.forEach((doc) => batch.delete(doc.ref));
	await batch.commit();
};

const ManualAttempt = (grammarPointId: string, answeredAt: Date): Attempt => ({
	grammarPointId,
	stage: 0 as Stage,
	answer: "added manually",
	isCorrect: true,
	answeredAt,
	reviewSessionId: uuid(),
});

export const addToRepetitions = async (
	user: User,
	grammarPointId: string,
	when: Date,
) => {
	await firestore.collection("sr").add({
		userId: user.id,
		...ManualAttempt(grammarPointId, when),
	});
};
