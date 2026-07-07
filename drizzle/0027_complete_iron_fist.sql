CREATE INDEX "space_repetition_userId_index" ON "grumma"."space_repetition" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX "exercise_part_exerciseId_index" ON "tmp"."exercise_part" USING btree ("exerciseId");
--> statement-breakpoint
CREATE INDEX "exercise_tmp_grammarPointId_index" ON "tmp"."exercise_tmp" USING btree ("grammarPointId");