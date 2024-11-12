import type { GrammarPoint } from "@grammar-sdk";
import { Drill } from "../models/drill";
import type { User } from "../models/user";
import { firestore } from "./firestore";

const getDrillDocs = async (user: User) =>
  await firestore.collection("review").where("userId", "==", user.id).get();

export const addToDrill = async (user: User, grammarPoint: GrammarPoint) => {
  await firestore.collection("review").add({
    userId: user.id,
    ...Drill(grammarPoint.id, 0),
  });
};

export const getDrill = async (user: User): Promise<Drill[]> => {
  const userReviews = await getDrillDocs(user);

  return userReviews.docs.map((d) => d.data()) as Drill[];
};

export const removeFromDrill = async (
  user: User,
  grammarPointId: string,
): Promise<void> => {
  const removing = await firestore
    .collection("review")
    .where("grammarPointId", "==", grammarPointId)
    .where("userId", "==", user.id)
    .get();

  const batch = firestore.batch();

  removing.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};
