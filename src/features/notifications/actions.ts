import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { getTopics } from "discourse-sdk";
import { contextFromAstro } from "~/libs/context";
import { cache } from "libs/cache";
import logger from "libs/logger";
import { db } from "libs/db";
import { notificationsRead } from "libs/db/schema";
import { eq } from "drizzle-orm";

const DISCOURSE_COLLECTION_START = new Date("2026-06-15T00:00:00Z");

type NotificationSource = "community";

export type Notification = {
  id: string;
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
        return await getNotifications(user.id);
      } catch (error) {
        logger.error(error, "Failed to fetch notifications");
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch notifications",
        });
      }
    },
  }),
  // TODO: consider a better algorithm if there are more sources or a large number of notifications
  readAll: defineAction({
    handler: async (_input, context) => {
      const { user } = contextFromAstro(context);
      if (user.role === "guest") {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Guests cannot mark notifications as read",
        });
      }

      try {
        const notifications = await getNotifications(user.id);

        await db
          .insert(notificationsRead)
          .values(
            notifications.map((notification) => ({
              userId: user.id,
              notificationId: `${notification.id}`,
              source: notification.source,
              readAt: new Date(),
            })),
          )
          .onConflictDoNothing();
        return { success: true };
      } catch (error) {
        logger.error(error, "Failed to mark notifications as read");
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mark notifications as read",
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

type SourceNotification = Omit<Notification, "read">;

const getCommunityNotifications = async (): Promise<SourceNotification[]> => {
  const topics = await getTopics({ after: DISCOURSE_COLLECTION_START });

  return topics.map((topic) => ({
    id: String(topic.id),
    source: "community",
    link: topic.link,
    title: topic.title,
    content: topic.excerpt,
    createdAt: topic.createdAt,
  }));
};

const getNotifications = async (userId: string): Promise<Notification[]> => {
  const cachedNotifications = await getCachedNotifications("community");

  const getSourceNotifications = async (): Promise<SourceNotification[]> => {
    if (!cachedNotifications) {
      logger.info("[notifications] cache miss");
      return await getCommunityNotifications();
    }
    logger.info("[notifications] cache hit");
    return cachedNotifications;
  };

  const sourceNotifications: SourceNotification[] =
    await getSourceNotifications();

  const readNotifications = await getReadNotifications(userId);

  const notifications = sourceNotifications.map((notification) => ({
    ...notification,
    read:
      readNotifications.get(`${notification.id}-${notification.source}`) ??
      false,
  }));

  await cacheNotifications("community", notifications);
  return notifications;
};

const getReadNotifications = async (
  userId: string,
): Promise<Map<`${string}-${NotificationSource}`, boolean>> => {
  const rows = await db
    .select()
    .from(notificationsRead)
    .where(eq(notificationsRead.userId, userId));

  const map = new Map<`${string}-${NotificationSource}`, boolean>();
  rows.forEach((row) => {
    map.set(`${row.notificationId}-${row.source}`, true);
  });
  return map;
};
