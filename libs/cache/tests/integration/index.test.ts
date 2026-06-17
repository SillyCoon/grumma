import { Cache } from "../../index";
import { eq } from "drizzle-orm";

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
import { makeDb } from "../../../../libs/db";
import { cache } from "../../../../libs/db/schema";

describe("Cache", () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let db: ReturnType<typeof makeDb>;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer("postgres:15.6-alpine")
      .withExposedPorts({ container: 5432, host: 6546 })
      .start();

    execSync(
      `DATABASE_URL=${postgresContainer.getConnectionUri()} bunx --yes drizzle-kit push`,
    );

    db = makeDb(postgresContainer.getConnectionUri());
  }, 30000);

  afterAll(async () => {
    await postgresContainer.stop();
  });

  beforeEach(async () => {
    await db.delete(cache).execute();
  });

  test("should replace existing entry with the same key", async () => {
    const key = "testKey";
    const value1 = { foo: "bar" };
    const value2 = { foo: "baz" };

    await Cache.set(key, value1, 60);
    await Cache.set(key, value2, 60);

    const cachedValue = await Cache.get<typeof value2>(key);
    expect(cachedValue).toEqual(value2);
  });

  test("should set and get a cache entry", async () => {
    const key = "testKey";
    const value = { foo: "bar" };

    await Cache.set(key, value, 60);
    const cachedValue = await Cache.get<typeof value>(key);

    expect(cachedValue).toEqual(value);
  });

  test("should return null for expired entries", async () => {
    const key = "testKey";
    const value = { foo: "bar" };
    await Cache.set(key, value, 1); // Set with 1 second TTL

    // Wait for 2 seconds to ensure the entry has expired
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const cachedValue = await Cache.get<typeof value>(key);
    expect(cachedValue).toBeNull();
  });

  test("should delete expired entries", async () => {
    const key = "testKey";
    const value = { foo: "bar" };
    await Cache.set(key, value, 1); // Set with 1 second TTL

    // Wait for 2 seconds to ensure the entry has expired
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Try to get the expired entry
    const cachedValue = await Cache.get<typeof value>(key);
    expect(cachedValue).toBeNull();

    // Check if the entry has been deleted from the database
    const data = await db
      .select()
      .from(cache)
      .where(eq(cache.key, key))
      .execute();
    expect(data.length).toBe(0);
  });

  test("should return null for non-existent keys", async () => {
    const cachedValue = await Cache.get("nonExistentKey");
    expect(cachedValue).toBeNull();
  });

  test("should handle parsing errors gracefully", async () => {
    const key = "testKey";
    // Insert an entry with invalid JSON value directly into the database
    await db.insert(cache).values({
      key,
      value: "invalid json",
      insertedAt: new Date(),
    });

    const cachedValue = await Cache.get(key);
    expect(cachedValue).toBeNull();
  });
});
