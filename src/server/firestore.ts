import { Firestore, type Timestamp } from "@google-cloud/firestore";

export const firestore = new Firestore();

export const timestampToDate = (timestamp: Date | string | Timestamp) => {
  if (timestamp instanceof Date || typeof timestamp === "string") {
    return new Date(timestamp);
  }
  return timestamp.toDate();
};
