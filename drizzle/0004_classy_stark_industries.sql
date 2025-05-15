ALTER TABLE "grumma"."coming_soon" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "grumma"."coming_soon" CASCADE;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "structure" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "detailedTitle" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "englishTitle" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "torfl" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ALTER COLUMN "torfl" DROP NOT NULL;