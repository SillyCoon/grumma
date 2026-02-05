CREATE TABLE IF NOT EXISTS "grumma"."tour" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grumma"."tour_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
