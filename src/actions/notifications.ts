import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { getTopics } from "packages/discourse-sdk";
import { contextFromAstro } from "~/libs/context";

const DISCOURSE_COLLECTION_START = new Date("2026-06-15T00:00:00Z");

type NotificationSource = "discourse";

export type Notification = {
  id: number;
  source: NotificationSource;
  link: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
};

export const notifications = {
  getNotifications: defineAction({
    input: z.union([
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      z.undefined(),
    ]),
    handler: async (input, context) => {
      const { user } = contextFromAstro(context);
      if (user.role === "guest") {
        return [];
      }

      const topics = await getTopics({ after: DISCOURSE_COLLECTION_START });

      return topics.map((topic) => ({
        id: topic.id,
        source: "discourse",
        link: topic.link,
        title: topic.title,
        content: topic.excerpt,
        createdAt: topic.createdAt,
        read: false, // This would need to be tracked in a database for a real implementation;
      }));
    },
  }),
};
