import { ActionError, defineAction } from "astro:actions";
import { getLatestTopics, type LatestTopic } from "discourse-sdk";
import { contextFromAstro } from "~/libs/context";
import { cache } from "~/libs/cache";
import logger from "logger";

export const latestTopics = {
  getLatestTopics: defineAction({
    accept: "json",
    handler: async (_input, context) => {
      const { user } = contextFromAstro(context);
      if (user.role === "guest") {
        return [];
      }
      try {
        return (await getLatestTopicsWithCache()).toSorted(
          (a, b) => b.lastPostedAt.getTime() - a.lastPostedAt.getTime(),
        );
      } catch (error) {
        logger.error(error, "Failed to fetch latest topics");
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch latest topics",
        });
      }
    },
  }),
};

const cacheKey = "discourse_latest_topics";
const cacheDuration = 10 * 60 * 1000; // 10 minutes

const getLatestTopicsWithCache = async () => {
  const cachedTopics = await cache().get<LatestTopic[]>(
    cacheKey,
    (v: unknown): LatestTopic[] => {
      if (!Array.isArray(v)) {
        throw new Error("Cached value is not an array");
      }
      return v.map((item) => {
        if (typeof item !== "object" || item === null) {
          throw new Error("Cached value is not a valid LatestTopic");
        }
        return {
          ...item,
          createdAt: new Date(item.createdAt),
          lastPostedAt: new Date(item.lastPostedAt),
        };
      });
    },
  );
  if (cachedTopics) return cachedTopics;
  const topics = (await getLatestTopics()).slice(0, 6);
  cache()
    .set(cacheKey, topics, cacheDuration)
    .catch((e) => {
      logger.error(e, "Failed to cache latest topics");
    });
  return topics;
};
