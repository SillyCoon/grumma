CREATE SCHEMA IF NOT EXISTS cache;
CREATE UNLOGGED TABLE "cache"."cache" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "key" text UNIQUE NOT NULL,
    "value" jsonb NOT NULL,
    "insertedAt" timestamp NOT NULL DEFAULT NOW(),
    "expiresAt" timestamp
);
CREATE OR REPLACE PROCEDURE "cache"."expire_rows" () AS $$ BEGIN
DELETE FROM "cache"."cache"
WHERE "expiresAt" IS NOT NULL
    AND "expiresAt" < NOW();
COMMIT;
END;
$$ LANGUAGE plpgsql;
SELECT cron.schedule(
        '0 * * * *',
        $$CALL "cache"."expire_rows"();
$$
);