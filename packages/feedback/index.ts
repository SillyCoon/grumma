import type { DbClient } from "libs/db";
import { feedback as feedbackSchema } from "../../libs/db/schema";

type Feedback = {
  message: string;
  email?: string;
  grammar?: {
    grammarPointId: number;
    exerciseOrder: number;
  };
  userId?: string;
  createdAt: Date;
};

export const saveFeedback = async (db: DbClient, feedback: Feedback) => {
  await db.insert(feedbackSchema).values({
    createdAt: feedback.createdAt,
    email: feedback.email,
    exerciseOrder: feedback.grammar?.exerciseOrder,
    grammarPointId: feedback.grammar?.grammarPointId,
    message: feedback.message,
    userId: feedback.userId,
  });
};
