CREATE SCHEMA IF NOT EXISTS cache;
CREATE UNLOGGED TABLE "cache"."cache" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "key" text UNIQUE NOT NULL,
    "value" jsonb NOT NULL,
    "insertedAt" timestamp NOT NULL DEFAULT NOW(),
    "expiresAt" timestamp
);
CREATE INDEX idx_cache_key ON "cache"."cache" ("key");
CREATE OR REPLACE PROCEDURE "cache"."expire_rows" (retention_period INTERVAL) AS $$ BEGIN
DELETE FROM "cache"."cache"
WHERE "insertedAt" < NOW() - retention_period;
COMMIT;
END;
$$ LANGUAGE plpgsql;
SELECT cron.schedule(
        '0 * * * *',
        $$CALL "cache"."expire_rows"('1 hour');
$$
);