CREATE TABLE IF NOT EXISTS "grumma"."feedback" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grumma"."feedback_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text,
	"grammarPointId" integer,
	"exerciseOrder" integer,
	"message" text NOT NULL,
	"email" text,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grumma"."feedback" ADD CONSTRAINT "feedback_grammarPointId_grammar_point_id_fk" FOREIGN KEY ("grammarPointId") REFERENCES "grumma"."grammar_point"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
