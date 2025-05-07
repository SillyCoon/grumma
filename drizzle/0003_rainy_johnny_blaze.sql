CREATE TABLE IF NOT EXISTS "grumma"."coming_soon" (
	"id" integer PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"shortTitle" text NOT NULL,
	"structure" text,
	"detailedTitle" text,
	"englishTitle" text,
	"torfl" varchar(2),
	CONSTRAINT "coming_soon_shortTitle_unique" UNIQUE("shortTitle"),
	CONSTRAINT "coming_soon_detailedTitle_unique" UNIQUE("detailedTitle"),
	CONSTRAINT "coming_soon_englishTitle_unique" UNIQUE("englishTitle")
);
--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "structure" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "shortTitle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "detailedTitle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "englishTitle" SET NOT NULL;