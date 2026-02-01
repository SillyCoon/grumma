ALTER TABLE "tmp"."acceptable_answer" DROP CONSTRAINT "acceptable_answer_answerId_exercise_part_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tmp"."acceptable_answer" ADD CONSTRAINT "acceptable_answer_answerId_exercise_part_id_fk" FOREIGN KEY ("answerId") REFERENCES "tmp"."exercise_part"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
