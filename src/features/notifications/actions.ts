import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { getTopics } from "packages/discourse-sdk";
import { contextFromAstro } from "~/libs/context";
import { cache } from "libs/cache";
import { Seq } from "immutable";
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
        return getNotifications();
      } catch (error) {
        logger.error(error, "Failed to fetch notifications");
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch notifications",
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    },
  }),
};

const cacheKey = (source: NotificationSource) => `notifications-${source}`;

const cacheNotifications = async (notifications: Notification[]) => {
  if (!notifications.length) return null;

  const notificationsBySource = Seq(notifications).groupBy(
    (notification) => notification.source,
  );

  for (const [source, notifications] of notificationsBySource) {
    await cache.set(cacheKey(source), notifications.toArray(), 60 * 60);
  }
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

  await cacheNotifications(notifications);
  return notifications;
};
