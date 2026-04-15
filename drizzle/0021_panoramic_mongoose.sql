ALTER TABLE "grumma"."feedback" DROP CONSTRAINT "feedback_grammarPointId_grammar_point_id_fk";
--> statement-breakpoint
ALTER TABLE "grumma"."space_repetition" DROP CONSTRAINT "space_repetition_grammarPointId_grammar_point_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grumma"."feedback" ADD CONSTRAINT "feedback_grammarPointId_grammar_point_tmp_id_fk" FOREIGN KEY ("grammarPointId") REFERENCES "tmp"."grammar_point_tmp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grumma"."space_repetition" ADD CONSTRAINT "space_repetition_grammarPointId_grammar_point_tmp_id_fk" FOREIGN KEY ("grammarPointId") REFERENCES "tmp"."grammar_point_tmp"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
