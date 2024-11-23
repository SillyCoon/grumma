ALTER TABLE "grumma"."grammar_point" ADD COLUMN "shortTitle" text;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ADD COLUMN "detailedTitle" text;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ADD COLUMN "englishTitle" text;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ADD CONSTRAINT "grammar_point_shortTitle_unique" UNIQUE("shortTitle");--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ADD CONSTRAINT "grammar_point_detailedTitle_unique" UNIQUE("detailedTitle");--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ADD CONSTRAINT "grammar_point_englishTitle_unique" UNIQUE("englishTitle");