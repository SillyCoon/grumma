import { eq } from "drizzle-orm";
import { cache } from "libs/db/schema";
import { db } from "libs/db";
import crypto from "node:crypto";

const set = async (key: string, value: object, ttlSeconds?: number) => {
  const expiresAt = ttlSeconds
    ? new Date(Date.now() + ttlSeconds * 1000)
    : null;

  await db
    .insert(cache)
    .values({
      key,
      value,
      expiresAt,
      insertedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: cache.key,
      set: {
        value,
        expiresAt,
        insertedAt: new Date(),
      },
    })
    .execute();
};

const setByHash = async (value: object, ttlSeconds?: number) => {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");

  await set(hash, value, ttlSeconds);
  return hash;
};

const get = async <T>(key: string, parser?: (value: unknown) => T) => {
  const data = await db
    .select()
    .from(cache)
    .where(eq(cache.key, key))
    .execute();

  if (data.length === 0) {
    return null;
  }

  const entry = data[0];

  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    // Entry has expired, delete it
    await db.delete(cache).where(eq(cache.key, key)).execute();
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

export const Cache = {
  set,
  get,
  setByHash,
};
