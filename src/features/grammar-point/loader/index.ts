import type { LiveLoader } from "astro/loaders";
import {
  type Context,
  type GrammarPoint,
  fetchAllGrammarPoints,
  fetchGrammarPoint,
  fetchGrammarPoints,
} from "grammar-sdk";
import logger from "libs/logger";
import { GrammarPointNotFoundError, GrammarPointsLoaderError } from "./errors";

const grammarPointsToEntries = (grammarPoints: GrammarPoint[]) => ({
  entries: grammarPoints.map(grammarPointToEntry),
});

const grammarPointToEntry = (grammarPoint: GrammarPoint) => ({
  id: grammarPoint.id,
  data: grammarPoint,
  cacheHint: {
    tags: [`grammar-point-${grammarPoint.id}`],
  },
});

export function grammarPointsLoader(): LiveLoader<
  GrammarPoint,
  { id: string; context: Context },
  { ids: string[]; context: Context } | { context: Context }
> {
  return {
    name: "grammarPoints",
    loadCollection: async ({ filter }) => {
      try {
        if (filter && "ids" in filter) {
          return {...grammarPointsToEntries(
            await fetchGrammarPoints(filter.ids, filter.context),
          ), cacheHint: {
            tags: [`grammar-points-${filter.context.user.role}-${filter.ids.join(",")}`],
          }};
        }

        const context = filter?.context ?? { user: { role: "guest" } };

        return {
          ...grammarPointsToEntries(await fetchAllGrammarPoints(context)),
          cacheHint: {
            tags: [`grammar-points-${context.user.role}`],
          },
        };
      } catch (error) {
        const message = "Failed to load grammar points";
        logger.error(error, message);
        return {
          error: new GrammarPointsLoaderError(message, 500),
        };
      }
    },
    loadEntry: async ({ filter: { id, context } }) => {
      try {
        const entry = await fetchGrammarPoint(id, context);
        if (!entry) {
          return {
            error: new GrammarPointNotFoundError(
              `Grammar point with id ${id} not found`,
            ),
          };
        }
        return grammarPointToEntry(entry);
      } catch (error) {
        const message = `Failed to load grammar point with id ${id}`;
        logger.error(error, message);
        return {
          error: new GrammarPointsLoaderError(message, 500),
        };
      }
    },
  };
}
