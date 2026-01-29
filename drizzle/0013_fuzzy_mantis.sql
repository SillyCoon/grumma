-- Custom SQL migration file, put your code below! --
ALTER TABLE "tmp"."exercise_tmp"
DROP CONSTRAINT exercise_tmp_order_unique;

ALTER TABLE "tmp"."exercise_tmp"
ADD CONSTRAINT exercise_tmp_order_unique
UNIQUE ("order")
DEFERRABLE INITIALLY DEFERRED;