CREATE SCHEMA IF NOT EXISTS "tmp";

CREATE TABLE IF NOT EXISTS "tmp"."exercise" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tmp"."exercise_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"grammarPointId" integer NOT NULL,
	"order" integer NOT NULL,
	"ru" text NOT NULL,
	"en" text NOT NULL,
	"helper" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exercise_order_unique" UNIQUE("order")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tmp"."grammar_point" (
	"id" integer PRIMARY KEY NOT NULL,
	"shortTitle" text NOT NULL,
	"detailedTitle" text,
	"englishTitle" text,
	"order" integer NOT NULL,
	"structure" text,
	"torfl" varchar(2),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "grammar_point_shortTitle_unique" UNIQUE("shortTitle"),
	CONSTRAINT "grammar_point_detailedTitle_unique" UNIQUE("detailedTitle"),
	CONSTRAINT "grammar_point_englishTitle_unique" UNIQUE("englishTitle"),
	CONSTRAINT "grammar_point_order_unique" UNIQUE("order")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tmp"."exercise" ADD CONSTRAINT "exercise_grammarPointId_grammar_point_id_fk" FOREIGN KEY ("grammarPointId") REFERENCES "tmp"."grammar_point"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
