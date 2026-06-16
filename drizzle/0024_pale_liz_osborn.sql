CREATE TYPE "grumma"."notificationSource" AS ENUM('community');--> statement-breakpoint
CREATE TABLE "grumma"."notifications_read" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grumma"."notifications_read_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"notificationId" text NOT NULL,
	"source" "grumma"."notificationSource" NOT NULL,
	"readAt" timestamp NOT NULL
);
