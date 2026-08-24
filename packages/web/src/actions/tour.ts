import { defineAction } from "astro:actions";
import { defaultDb } from "db";
import { tour as tourSchema } from "db/schema";
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
      await defaultDb().insert(tourSchema).values({
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
      await defaultDb()
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
      const tourEntry = await defaultDb()
        .select()
        .from(tourSchema)
        .where(and(eq(tourSchema.userId, user.id), eq(tourSchema.type, type)))
        .limit(1);
      return tourEntry?.[0]?.completed ?? false;
    },
  }),
};
