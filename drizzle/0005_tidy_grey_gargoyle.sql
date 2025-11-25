ALTER TABLE "grumma"."exercise" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."exercise" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "grumma"."grammar_point" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;