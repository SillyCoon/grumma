import { initFirestore } from "@auth/firebase-adapter";
import type { Timestamp } from "firebase-admin/firestore";

export const firestore = initFirestore();

export const timestampToDate = (timestamp: Date | string | Timestamp) => {
	if (timestamp instanceof Date || typeof timestamp === "string") {
		return new Date(timestamp);
	}
	return timestamp.toDate();
};
