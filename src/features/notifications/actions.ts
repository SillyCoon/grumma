import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { getTopics } from "discourse-sdk";
import { contextFromAstro } from "~/libs/context";
import { cache } from "libs/cache";
import logger from "libs/logger";

const DISCOURSE_COLLECTION_START = new Date("2026-06-15T00:00:00Z");

type NotificationSource = "community";

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
    handler: async (_input, context) => {
      const { user } = contextFromAstro(context);
      if (user.role === "guest") {
        return [];
      }
      try {
        return await getNotifications();
      } catch (error) {
        logger.error(error, "Failed to fetch notifications");
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch notifications",
        });
      }
    },
  }),
};

const cacheKey = (source: NotificationSource) => `notifications-${source}`;

const cacheNotifications = async (
  source: NotificationSource,
  notifications: Notification[],
) => {
  await cache.set(cacheKey(source), notifications, 60 * 60);
};

const getCachedNotifications = async (source: NotificationSource) => {
  return cache.get<Notification[]>(
    cacheKey(source),
    (value) => value as Notification[],
  );
};

const getNotifications = async (): Promise<Notification[]> => {
  const cachedNotifications = await getCachedNotifications("community");
  if (cachedNotifications) {
    logger.info("[notifications] cache hit");
    return cachedNotifications;
  }
  logger.info("[notifications] cache miss");

  const topics = await getTopics({ after: DISCOURSE_COLLECTION_START });

  const notifications: Notification[] = topics.map((topic) => ({
    id: topic.id,
    source: "community",
    link: topic.link,
    title: topic.title,
    content: topic.excerpt,
    createdAt: topic.createdAt,
    read: true, // This would need to be tracked in a database for a real implementation;
  }));

  await cacheNotifications("community", notifications);
  return notifications;
};
