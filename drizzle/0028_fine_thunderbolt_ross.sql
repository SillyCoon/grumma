ALTER TABLE "tmp"."exercise_tmp" DROP CONSTRAINT "exercise_tmp_grammarPointId_order_unique";
--> statement-breakpoint
ALTER TABLE "tmp"."exercise_tmp"
ADD CONSTRAINT "exercise_tmp_grammarPointId_order_unique" UNIQUE("grammarPointId", "order") DEFERRABLE INITIALLY DEFERRED;