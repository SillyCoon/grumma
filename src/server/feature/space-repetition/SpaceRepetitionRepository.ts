import type { User } from "../../../models/user";
import type { Attempt } from "./types/Attempt";
import { v4 as uuid } from "uuid";
import type { Stage } from "./types/Stage";
import type { DbClient } from "libs/db";
import { and, eq } from "drizzle-orm";
import { spaceRepetitions } from "libs/db/schema";

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

const ManualAttempt = (grammarPointId: string, answeredAt: Date): Attempt => ({
  grammarPointId,
  stage: 0 as Stage,
  answer: "added manually",
  isCorrect: true,
  answeredAt,
  reviewSessionId: uuid(),
});

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
