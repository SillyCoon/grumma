import { CacheFactory, type Cache } from "../../index";
import { eq } from "drizzle-orm";

import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execFileSync, execSync } from "node:child_process";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { makeDb } from "../../../../libs/db";
import { cache as cacheTable } from "../../../../libs/db/schema";

let cache: Cache;

describe("Cache", () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let db: ReturnType<typeof makeDb>;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer("postgres:15.6-alpine")
      .withExposedPorts({ container: 5432, host: 6548 })
      .start();

    execFileSync("bunx", ["--yes", "drizzle-kit", "push"], {
      env: {
        ...process.env,
        DATABASE_URL: postgresContainer.getConnectionUri(),
      },
      stdio: "inherit",
    });

    db = makeDb(postgresContainer.getConnectionUri());
    cache = CacheFactory(db);
  }, 30000);

  afterAll(async () => {
    await postgresContainer.stop();
  });

  beforeEach(async () => {
    await db.delete(cacheTable).execute();
  });

  test("should replace existing entry with the same key", async () => {
    const key = "testKey";
    const value1 = { foo: "bar" };
    const value2 = { foo: "baz" };

    await cache.set(key, value1, 60);
    await cache.set(key, value2, 60);

    const cachedValue = await cache.get<typeof value2>(key);
    expect(cachedValue).toEqual(value2);
  });

  test("should set and get a cache entry", async () => {
    const key = "testKey";
    const value = { foo: "bar" };

    await cache.set(key, value, 60);
    const cachedValue = await cache.get<typeof value>(key);

    expect(cachedValue).toEqual(value);
  });

  test("should return null for expired entries", async () => {
    const key = "testKey";
    const value = { foo: "bar" };
    await cache.set(key, value, 1); // Set with 1 second TTL

    // Wait for 2 seconds to ensure the entry has expired
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const cachedValue = await cache.get<typeof value>(key);
    expect(cachedValue).toBeNull();
  });

  test("should delete expired entries", async () => {
    const key = "testKey";
    const value = { foo: "bar" };
    await cache.set(key, value, 1); // Set with 1 second TTL

    // Wait for 2 seconds to ensure the entry has expired
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Try to get the expired entry
    const cachedValue = await cache.get<typeof value>(key);
    expect(cachedValue).toBeNull();

    // Check if the entry has been deleted from the database
    const data = await db
      .select()
      .from(cacheTable)
      .where(eq(cacheTable.key, key))
      .execute();
    expect(data.length).toBe(0);
  });

  test("should return null for non-existent keys", async () => {
    const cachedValue = await cache.get("nonExistentKey");
    expect(cachedValue).toBeNull();
  });

  test("should handle parsing errors gracefully", async () => {
    const key = "testKey";
    // Insert an entry with invalid JSON value directly into the database
    await db.insert(cacheTable).values({
      key,
      value: "some value",
      insertedAt: new Date(),
    });

    const cachedValue = await cache.get(key, () => {
      throw new Error("Parsing error");
    });
    expect(cachedValue).toBeNull();
  });
});
