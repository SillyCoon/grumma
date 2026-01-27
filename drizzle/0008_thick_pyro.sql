ALTER TABLE "tmp"."exercise" RENAME TO "exercise_tmp";--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point" RENAME TO "grammar_point_tmp";--> statement-breakpoint
ALTER TABLE "tmp"."exercise_tmp" DROP CONSTRAINT "exercise_order_unique";--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" DROP CONSTRAINT "grammar_point_shortTitle_unique";--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" DROP CONSTRAINT "grammar_point_detailedTitle_unique";--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" DROP CONSTRAINT "grammar_point_englishTitle_unique";--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" DROP CONSTRAINT "grammar_point_order_unique";--> statement-breakpoint
ALTER TABLE "tmp"."exercise_part" DROP CONSTRAINT "exercise_part_exerciseId_exercise_id_fk";
--> statement-breakpoint
ALTER TABLE "tmp"."exercise_tmp" DROP CONSTRAINT "exercise_grammarPointId_grammar_point_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tmp"."exercise_part" ADD CONSTRAINT "exercise_part_exerciseId_exercise_tmp_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "tmp"."exercise_tmp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tmp"."exercise_tmp" ADD CONSTRAINT "exercise_tmp_grammarPointId_grammar_point_tmp_id_fk" FOREIGN KEY ("grammarPointId") REFERENCES "tmp"."grammar_point_tmp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tmp"."exercise_tmp" ADD CONSTRAINT "exercise_tmp_order_unique" UNIQUE("order");--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" ADD CONSTRAINT "grammar_point_tmp_shortTitle_unique" UNIQUE("shortTitle");--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" ADD CONSTRAINT "grammar_point_tmp_detailedTitle_unique" UNIQUE("detailedTitle");--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" ADD CONSTRAINT "grammar_point_tmp_englishTitle_unique" UNIQUE("englishTitle");--> statement-breakpoint
ALTER TABLE "tmp"."grammar_point_tmp" ADD CONSTRAINT "grammar_point_tmp_order_unique" UNIQUE("order");