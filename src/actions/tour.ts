import { defineAction } from "astro:actions";
import { db } from "libs/db";
import { tour as tourSchema } from "libs/db/schema";
import { extractUser } from "./utils";
import { z } from "astro/zod";
import { and, eq } from "drizzle-orm";

export const tour = {
  finishTour: defineAction({
    accept: "json",
    input: z.object({
      type: z.string(),
    }),
    handler: async ({ type }, context) => {
      const user = extractUser(context);
      await db.insert(tourSchema).values({
        userId: user.id,
        type,
        completed: true,
      });
    },
  }),
  resetTour: defineAction({
    accept: "json",
    input: z.object({
      type: z.string(),
    }),
    handler: async ({ type }, context) => {
      const user = extractUser(context);
      await db
        .delete(tourSchema)
        .where(and(eq(tourSchema.userId, user.id), eq(tourSchema.type, type)));
    },
  }),
  getTourStatus: defineAction({
    accept: "json",
    input: z.object({
      type: z.string(),
    }),
    handler: async ({ type }, context) => {
      const user = extractUser(context);
      const tourEntry = await db
        .select()
        .from(tourSchema)
        .where(and(eq(tourSchema.userId, user.id), eq(tourSchema.type, type)))
        .limit(1);
      return tourEntry?.[0]?.completed ?? false;
    },
  }),
};
