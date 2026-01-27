CREATE SCHEMA IF NOT EXISTS "tmp";
--> statement-breakpoint
CREATE TYPE "tmp"."exercisePartType" AS ENUM('text', 'answer');--> statement-breakpoint
CREATE TYPE "tmp"."acceptableAnswerVariant" AS ENUM('correct', 'incorrect', 'try-again');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tmp"."acceptable_answer" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tmp"."acceptable_answer_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"answerId" integer NOT NULL,
	"text" text NOT NULL,
	"description" text,
	"variant" "tmp"."acceptableAnswerVariant" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tmp"."exercise_part" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tmp"."exercise_part_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"exerciseId" integer NOT NULL,
	"order" integer NOT NULL,
	"type" "tmp"."exercisePartType" NOT NULL,
	"text" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tmp"."acceptable_answer" ADD CONSTRAINT "acceptable_answer_answerId_exercise_part_id_fk" FOREIGN KEY ("answerId") REFERENCES "tmp"."exercise_part"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tmp"."exercise_part" ADD CONSTRAINT "exercise_part_exerciseId_exercise_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "tmp"."exercise"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tmp"."exercise" DROP COLUMN IF EXISTS "ru";--> statement-breakpoint
ALTER TABLE "tmp"."exercise" DROP COLUMN IF EXISTS "en";--> statement-breakpoint
ALTER TABLE "tmp"."exercise" DROP COLUMN IF EXISTS "helper";