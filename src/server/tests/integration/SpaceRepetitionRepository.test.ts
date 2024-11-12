import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import {
  addToRepetitions,
  getAttempts,
  removeFromRepetitions,
  saveAttempt,
} from "../../feature/space-repetition/SpaceRepetitionRepository";
import type { Attempt } from "../../feature/space-repetition/types/Attempt";
import { v4 as uuid } from "uuid";
import { grammarPoints, spaceRepetitions } from "libs/db/schema";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "node:child_process";
import { makeDb } from "libs/db";

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
  let postgresContainer: StartedPostgreSqlContainer;
  let db: ReturnType<typeof makeDb>;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer()
      .withExposedPorts({ container: 5432, host: 6543 })
      .start();

    execSync(
      `DATABASE_URL=${postgresContainer.getConnectionUri()} bunx --yes drizzle-kit push`,
    );

    db = makeDb(postgresContainer.getConnectionUri());

    await db.insert(grammarPoints).values([
      {
        id: 1,
        title: "hello",
      },
      {
        id: 2,
        title: "goodbye",
      },
    ]);
  }, 30000);

  afterAll(async () => {
    await postgresContainer.stop();
  });

  beforeEach(async () => {
    await db.delete(spaceRepetitions);
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

    await saveAttempt(db, attempt, user);

    const result = await db.query.spaceRepetitions.findMany();

    expect(result.length).toEqual(1);

    expect(result[0]).toEqual({
      ...attempt,
      id: expect.any(Number),
      grammarPointId: +grammarPointId,
      userId: user.id,
    });
  });

  test("getAttempts", async () => {
    const otherUserAttempt = mockAttempt("2");
    await saveAttempt(db, otherUserAttempt, { id: "2" });

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

    await saveAttempt(db, attempt, user);

    const result = await getAttempts(db, user);

    expect(result).toEqual([
      { ...attempt, id: expect.any(Number), userId: user.id },
    ]);
  });

  test("removeFromRepetitions", async () => {
    const otherUserAttempt = mockAttempt("2");
    await saveAttempt(db, otherUserAttempt, { id: "2" });

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

    await saveAttempt(db, attempt, user);

    await removeFromRepetitions(db, user, grammarPointId);

    const result = await getAttempts(db, user);

    expect(result).toEqual([]);

    const otherUserResult = await getAttempts(db, { id: "2" });

    expect(otherUserResult).toEqual([
      { ...otherUserAttempt, id: expect.any(Number), userId: "2" },
    ]);
  });

  test("addToRepetitions", async () => {
    const user = { id: "1" };
    const grammarPointId = "1";
    const addedAt = new Date();

    await addToRepetitions(db, user, grammarPointId, addedAt);

    const result = await getAttempts(db, user);

    expect(result).toEqual([
      {
        id: expect.any(Number),
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
