import { and, eq } from "drizzle-orm";
import { cache as cacheSchema } from "db/schema";
import { db, type DbClient } from "db";
import crypto from "node:crypto";

const set = async (
  db: DbClient,
  key: string,
  value: object,
  ttlSeconds?: number,
) => {
  const expiresAt =
    ttlSeconds !== undefined ? new Date(Date.now() + ttlSeconds * 1000) : null;

  await db
    .insert(cacheSchema)
    .values({
      key,
      value,
      expiresAt,
      insertedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: cacheSchema.key,
      set: {
        value,
        expiresAt,
        insertedAt: new Date(),
      },
    })
    .execute();
};

const setByHash = async (db: DbClient, value: object, ttlSeconds?: number) => {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");

  await set(db, hash, value, ttlSeconds);
  return hash;
};

const get = async <T>(
  db: DbClient,
  key: string,
  parser?: (value: unknown) => T,
) => {
  const data = await db
    .select()
    .from(cacheSchema)
    .where(eq(cacheSchema.key, key))
    .execute();

  if (data.length === 0) {
    return null;
  }

  const entry = data[0];

  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    // Entry has expired, delete it
    await db
      .delete(cacheSchema)
      .where(
        and(
          eq(cacheSchema.key, key),
          eq(cacheSchema.expiresAt, entry.expiresAt),
        ),
      )
      .execute();
    return null;
  }

  try {
    if (parser) {
      return parser(entry.value);
    }
    return entry.value as T;
  } catch (error) {
    console.error("Failed to parse cache value", error);
    return null;
  }
};

export const CacheFactory = (db: DbClient) => {
  return {
    set: (key: string, value: object, ttlSeconds?: number) =>
      set(db, key, value, ttlSeconds),
    get: <T>(key: string, parser?: (value: unknown) => T) =>
      get(db, key, parser),
    setByHash: (value: object, ttlSeconds?: number) =>
      setByHash(db, value, ttlSeconds),
  };
};

export type Cache = ReturnType<typeof CacheFactory>;
export const cache = CacheFactory(db);
