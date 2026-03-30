import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "node:child_process";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { err } from "neverthrow";
import { makeDb } from "../../../../libs/db";
import {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
  grammarPointsTmp,
} from "../../../../libs/db/schema-tmp";
import { getGrammarPoint, putExercises } from "../../src/db-new";
import type { Context } from "../../src/context";
import type { Exercise } from "../../src/exercise";

const adminContext: Context = { user: { role: "admin" } };
const userContext: Context = { user: { role: "user" } };
const guestContext: Context = { user: { role: "guest" } };

const createExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  grammarPointId: "1",
  order: 1,
  hide: false,
  parts: [
    { index: 0, type: "text", text: "Question text" },
    { index: 1, type: "answer", text: "Answer text", acceptableAnswers: [] },
  ],
  translationParts: [
    { index: 0, type: "text", text: "Translation text" },
    {
      index: 1,
      type: "answer",
      text: "Translation answer",
      acceptableAnswers: [],
    },
  ],
  ...overrides,
});

const withAnyId = <T extends object>(object: T): T => {
  return {
    ...object,
    id: expect.any(Number),
  };
};

describe("putExercises", () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let db: ReturnType<typeof makeDb>;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer("postgres:15.6-alpine")
      .withExposedPorts({ container: 5432, host: 6546 })
      .start();

    const connectionUri = postgresContainer.getConnectionUri();

    execSync(`DATABASE_URL=${connectionUri} bunx --yes drizzle-kit push`);

    db = makeDb(connectionUri);

    process.env.DATABASE_URL = connectionUri;
  }, 60000);

  afterAll(async () => {
    await postgresContainer.stop();
  });

  beforeEach(async () => {
    // BUG: The schema does not have ON DELETE CASCADE on exercisePartsTmp.exerciseId FK,
    // so we must delete exercisePartsTmp before deleting exercisesTmp, otherwise
    // the FK constraint blocks deletion of exercises.
    // Additionally, acceptableAnswersTmp must be deleted before exercisePartsTmp
    // since it has FK to exercisePartsTmp.
    await db.delete(acceptableAnswersTmp);
    await db.delete(exercisePartsTmp);
    await db.delete(exercisesTmp);
    await db.delete(grammarPointsTmp);

    await db.insert(grammarPointsTmp).values([
      {
        id: 1,
        shortTitle: "Test Grammar Point",
        detailedTitle: "Test Grammar Point",
        englishTitle: "Test Grammar Point",
        order: 1,
        structure: "test",
        torfl: "A1",
        hide: false,
      },
    ]);
  });

  describe("authorization", () => {
    test("should return AuthorizationError when context is user", async () => {
      const exercises = [createExercise()];

      const result = await putExercises(db, exercises, userContext);

      expect(result.isErr()).toBe(true);
      if (result.isOk()) return;
      const error = result.error;
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).name).toBe("AuthorizationError");
    });

    test("should return AuthorizationError when context is guest", async () => {
      const exercises = [createExercise()];

      const result = await putExercises(db, exercises, guestContext);

      expect(result.isErr()).toBe(true);
      if (result.isOk()) return;
      const error = result.error;
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).name).toBe("AuthorizationError");
    });
  });

  describe("validation", () => {
    test("should return error when exercises array is empty", async () => {
      const result = await putExercises(db, [], adminContext);

      expect(result).toEqual(
        err("Grammar point ID is required to create exercises."),
      );
    });

    test("should return error when grammar point does not exist", async () => {
      const exercises = [createExercise({ grammarPointId: "999" })];

      const result = await putExercises(db, exercises, adminContext);

      expect(result).toEqual(
        err(
          "Grammar point 999 should exist before creating exercises. Please create the grammar point first.",
        ),
      );
    });

    test("should return error when exercises belong to different grammar points", async () => {
      const exercises = [
        createExercise({ grammarPointId: "1", order: 1 }),
        createExercise({ grammarPointId: "2", order: 2 }),
      ];

      const result = await putExercises(db, exercises, adminContext);

      expect(result).toEqual(
        err("All exercises must belong to the same grammar point."),
      );
    });

    test("should return error when exercise order values are not unique", async () => {
      const exercises = [
        createExercise({ grammarPointId: "1", order: 1 }),
        createExercise({ grammarPointId: "1", order: 1 }),
      ];

      const result = await putExercises(db, exercises, adminContext);

      expect(result).toEqual(err("Exercise order values must be unique."));
    });
  });

  describe("create exercises", () => {
    test("should create a single exercise", async () => {
      const exercises = [createExercise({ grammarPointId: "1", order: 1 })];

      const result = await putExercises(db, exercises, adminContext);

      expect(result.isOk()).toBe(true);

      const created = await getGrammarPoint(1, db);
      expect(created?.exercises.length).toBe(1);
      expect(created?.exercises).toEqual(
        exercises.map(withAnyId).map((e) => ({
          ...e,
          parts: e.parts.map(withAnyId),
          translationParts: e.translationParts.map(withAnyId),
        })),
      );
    });

    test("should create multiple exercises", async () => {
      const exercises = [
        createExercise({ grammarPointId: "1", order: 1 }),
        createExercise({ grammarPointId: "1", order: 2 }),
        createExercise({ grammarPointId: "1", order: 3 }),
      ];

      const result = await putExercises(db, exercises, adminContext);

      expect(result.isOk()).toBe(true);

      const created = (await getGrammarPoint(1, db))?.exercises;

      expect(created).toEqual(
        exercises.map(withAnyId).map((e) => ({
          ...e,
          parts: e.parts.map(withAnyId),
          translationParts: e.translationParts.map(withAnyId),
        })),
      );
    });

    test("should create exercise with acceptable answers", async () => {
      const exercises = [
        createExercise({
          grammarPointId: "1",
          order: 1,
          parts: [
            { index: 0, type: "text", text: "Question text" },
            {
              index: 1,
              type: "answer",
              text: "Answer",
              acceptableAnswers: [
                { text: "Correct", description: "Good", variant: "correct" },
                { text: "Wrong", description: "Bad", variant: "incorrect" },
              ],
            },
          ],
          translationParts: [
            { index: 0, type: "text", text: "Translation" },
            {
              index: 1,
              type: "answer",
              text: "Translation answer",
              acceptableAnswers: [],
            },
          ],
        }),
      ];

      await putExercises(db, exercises, adminContext);
      const result = await getGrammarPoint(1, db);

      expect(result?.exercises[0].parts).toHaveLength(2);
      expect(result?.exercises[0].parts[0]).not.toHaveProperty(
        "acceptableAnswers",
      );
      expect(result?.exercises[0].parts[1]).toMatchObject({
        acceptableAnswers: [
          { text: "Correct", description: "Good", variant: "correct" },
          { text: "Wrong", description: "Bad", variant: "incorrect" },
        ],
      });
    });

    test("should create hidden exercises when hide is true", async () => {
      const exercises = [
        createExercise({ grammarPointId: "1", order: 1, hide: true }),
      ];

      const result = await putExercises(db, exercises, adminContext);

      expect(result.isOk()).toBe(true);

      const created = await getGrammarPoint(1, db);
      expect(created?.exercises.length).toBe(1);
      expect(created?.exercises[0].hide).toBe(true);
    });
  });

  describe("update exercises", () => {
    test("should hide existing exercise", async () => {
      const [existing] = await db
        .insert(exercisesTmp)
        .values({ grammarPointId: 1, order: 1, hide: false })
        .returning();

      const exercises = [
        createExercise({
          id: existing.id,
          grammarPointId: "1",
          order: 1,
          hide: true,
        }),
      ];

      const result = await putExercises(db, exercises, adminContext);

      expect(result.isOk()).toBe(true);

      const updated = await getGrammarPoint(1, db);
      expect(updated?.exercises[0].hide).toBe(true);
    });

    test("should update exercise order", async () => {
      const [existing] = await db
        .insert(exercisesTmp)
        .values({ grammarPointId: 1, order: 1, hide: false })
        .returning();

      const exercises = [
        createExercise({
          id: existing.id,
          grammarPointId: "1",
          order: 5,
          hide: false,
        }),
      ];

      const result = await putExercises(db, exercises, adminContext);

      expect(result.isOk()).toBe(true);

      const updated = await getGrammarPoint(1, db);
      expect(updated?.exercises[0].order).toBe(5);
    });

    test("should update exercise parts and translation parts", async () => {
      const existingExercise = [
        createExercise({
          id: 1,
          grammarPointId: "1",
          order: 1,
          parts: [
            { index: 0, type: "text", text: "Original question text" },
            {
              index: 1,
              type: "answer",
              text: "Original answer text",
              acceptableAnswers: [
                {
                  text: "Original correct answer",
                  description: "Original good answer",
                  variant: "correct",
                },
              ],
            },
          ],
          translationParts: [
            { index: 0, type: "text", text: "Original translation text" },
            {
              index: 1,
              type: "answer",
              text: "Original translation answer",
              acceptableAnswers: [],
            },
          ],
        }),
      ];
      await putExercises(db, existingExercise, adminContext);

      const update = [
        createExercise({
          id: existingExercise[0].id,
          grammarPointId: "1",
          order: 1,
          hide: false,
          parts: [
            { index: 0, type: "text", text: "Updated question text" },
            {
              index: 1,
              type: "answer",
              text: "Updated answer text",
              acceptableAnswers: [
                {
                  text: "New correct answer",
                  description: "New good answer",
                  variant: "correct",
                },
              ],
            },
          ],
          translationParts: [
            { index: 0, type: "text", text: "Updated translation text" },
            {
              index: 1,
              type: "answer",
              text: "Updated translation answer",
              acceptableAnswers: [],
            },
          ],
        }),
      ];

      const result = await putExercises(db, update, adminContext);

      expect(result.isOk()).toBe(true);

      const updated = (await getGrammarPoint(1, db))?.exercises;

      expect(updated).toEqual(
        update.map(withAnyId).map((e) => ({
          ...e,
          parts: e.parts.map(withAnyId),
          translationParts: e.translationParts.map(withAnyId),
        })),
      );
    });

    test("should add new acceptable answer to existing exercise part", async () => {
      const existingExercise = [
        createExercise({
          id: 1,
          grammarPointId: "1",
          order: 1,
          parts: [
            { index: 0, type: "text", text: "Question text" },
            {
              index: 1,
              type: "answer",
              text: "Answer text",
              acceptableAnswers: [
                {
                  text: "Existing correct answer",
                  description: "Existing good answer",
                  variant: "correct",
                },
              ],
            },
          ],
          translationParts: [
            { index: 0, type: "text", text: "Translation text" },
            {
              index: 1,
              type: "answer",
              text: "Translation answer",
              acceptableAnswers: [],
            },
          ],
        }),
      ];
      await putExercises(db, existingExercise, adminContext);

      const update = [
        createExercise({
          id: existingExercise[0].id,
          grammarPointId: "1",
          order: 1,
          hide: false,
          parts: [
            { index: 0, type: "text", text: "Question text" },
            {
              index: 1,
              type: "answer",
              text: "Answer text",
              acceptableAnswers: [
                {
                  text: "Existing correct answer",
                  description: "Existing good answer",
                  variant: "correct",
                },
                {
                  text: "New correct answer",
                  description: "New good answer",
                  variant: "correct",
                },
              ],
            },
          ],
          translationParts: [
            { index: 0, type: "text", text: "Translation text" },
            {
              index: 1,
              type: "answer",
              text: "Translation answer",
              acceptableAnswers: [],
            },
          ],
        }),
      ];

      const result = await putExercises(db, update, adminContext);

      expect(result.isOk()).toBe(true);

      const updated = (await getGrammarPoint(1, db))?.exercises;

      // @ts-expect-error - acceptableAnswers is optional in ExercisePart, but should be present in answer parts
      expect(updated?.[0].parts[1].acceptableAnswers).toHaveLength(2);
      // @ts-expect-error - acceptableAnswers is optional in ExercisePart, but should be present in answer parts
      expect(updated?.[0].parts[1].acceptableAnswers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: "Existing correct answer",
            description: "Existing good answer",
            variant: "correct",
          }),
          expect.objectContaining({
            text: "New correct answer",
            description: "New good answer",
            variant: "correct",
          }),
        ]),
      );
    });
  });

  describe("mixed create and update", () => {
    test("should create new exercises while updating existing ones", async () => {
      const [existing] = await db
        .insert(exercisesTmp)
        .values({ grammarPointId: 1, order: 1, hide: false })
        .returning();

      const exercises = [
        createExercise({
          id: existing.id,
          grammarPointId: "1",
          order: 1,
          hide: true,
        }),
        createExercise({ grammarPointId: "1", order: 2 }),
      ];

      const result = await putExercises(db, exercises, adminContext);

      expect(result.isOk()).toBe(true);

      const allExercises = await getGrammarPoint(1, db);

      expect(allExercises?.exercises.length).toBe(2);
      expect(allExercises?.exercises[0].id).toBe(existing.id);
      expect(allExercises?.exercises[0].hide).toBe(true);
      expect(allExercises?.exercises[1].id).not.toBe(existing.id);
    });
  });
});
