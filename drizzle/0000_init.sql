CREATE SCHEMA IF NOT EXISTS "grumma";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grumma"."exercise" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grumma"."exercise_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"grammarPointId" integer NOT NULL,
	"order" integer NOT NULL,
	"ru" text NOT NULL,
	"en" text NOT NULL,
	"helper" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grumma"."grammar_point" (
	"id" integer PRIMARY KEY NOT NULL,
	"order" integer,
	"structure" text,
	"title" text NOT NULL,
	"torfl" varchar(2) DEFAULT 'A1' NOT NULL,
	CONSTRAINT "grammar_point_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grumma"."space_repetition" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grumma"."space_repetition_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"answer" text,
	"answeredAt" timestamp NOT NULL,
	"grammarPointId" integer NOT NULL,
	"isCorrect" boolean NOT NULL,
	"reviewSessionId" uuid NOT NULL,
	"stage" integer NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grumma"."exercise" ADD CONSTRAINT "exercise_grammarPointId_grammar_point_id_fk" FOREIGN KEY ("grammarPointId") REFERENCES "grumma"."grammar_point"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grumma"."space_repetition" ADD CONSTRAINT "space_repetition_grammarPointId_grammar_point_id_fk" FOREIGN KEY ("grammarPointId") REFERENCES "grumma"."grammar_point"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
