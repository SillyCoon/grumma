-- Custom SQL migration file, put your code below! --
ALTER TABLE "tmp"."grammar_point_tmp"
DROP CONSTRAINT grammar_point_tmp_order_unique;

ALTER TABLE "tmp"."grammar_point_tmp"
ADD CONSTRAINT grammar_point_tmp_order_unique
UNIQUE ("order")
DEFERRABLE INITIALLY DEFERRED;