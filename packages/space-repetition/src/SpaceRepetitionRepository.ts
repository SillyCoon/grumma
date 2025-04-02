import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { DbClient } from "../../../libs/db";
import { spaceRepetitions } from "../../../libs/db/schema";
import type { User } from "../../../src/models/user";
import { Session } from "./session";
import type { Attempt } from "./types/Attempt";
import type { Stage } from "./types/Stage";

export const getAttempts = async (
  db: DbClient,
  user: User,
): Promise<Attempt[]> => {
  const tries = await db.query.spaceRepetitions.findMany({
    where: eq(spaceRepetitions.userId, user.id),
  });
  return tries.map((t) => ({
    ...t,
    grammarPointId: `${t.grammarPointId}`,
    stage: t.stage as Stage,
    answer: t.answer ?? "",
  }));
};

export const getSession = async (
  db: DbClient,
  user: User,
  sessionId: string,
): Promise<Session> => {
  const attempts = await getAttempts(db, user);
  return Session(attempts.filter((a) => a.reviewSessionId === sessionId));
};

export const saveAttempt = async (
  db: DbClient,
  attempt: Attempt,
  user: User,
): Promise<void> => {
  await db.insert(spaceRepetitions).values({
    ...attempt,
    grammarPointId: +attempt.grammarPointId,
    userId: user.id,
  });
};

export const removeFromRepetitions = async (
  db: DbClient,
  user: User,
  grammarPointId: string,
) => {
  await db
    .delete(spaceRepetitions)
    .where(
      and(
        eq(spaceRepetitions.userId, user.id),
        eq(spaceRepetitions.grammarPointId, +grammarPointId),
      ),
    );
};

export const ManualAttempt = (
  grammarPointId: string,
  answeredAt: Date,
): Attempt => ({
  grammarPointId,
  stage: 0 as Stage,
  answer: "added manually",
  isCorrect: true,
  answeredAt,
  reviewSessionId: uuid(),
});
export const isManualAttempt = (attempt: Attempt): boolean =>
  attempt.answer === "added manually";

export const addToRepetitions = async (
  db: DbClient,
  user: User,
  grammarPointId: string,
  when: Date,
) => {
  await db.insert(spaceRepetitions).values({
    userId: user.id,
    ...ManualAttempt(grammarPointId, when),
    grammarPointId: +grammarPointId,
  });
};
