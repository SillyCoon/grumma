// Define live collections for accessing real-time data
import { defineLiveCollection } from "astro:content";
import type { LiveLoader } from "astro/loaders";
import {
  type Context,
  type GrammarPoint,
  fetchAllGrammarPoints,
  fetchGrammarPoint,
  fetchGrammarPoints,
} from "grammar-sdk";

function grammarPointsLoader(): LiveLoader<
  GrammarPoint,
  { id: string; context: Context },
  { ids: string[]; context: Context } | { context: Context }
> {
  return {
    name: "grammarPoints",
    loadCollection: async ({ filter }) => {
      try {
        if (filter && "ids" in filter) {
          const entries = await fetchGrammarPoints(filter.ids, filter.context);
          return {
            entries: entries.map((entry) => ({
              id: entry.id,
              data: entry,
              cacheHint: {
                tags: [`grammar-point-${entry.id}`],
              },
            })),
          };
        }
        if (!filter) {
          const entries = await fetchAllGrammarPoints({
            user: { role: "guest" },
          });
          return {
            entries: entries.map((entry) => ({
              id: entry.id,
              data: entry,
              cacheHint: {
                tags: [`grammar-point-${entry.id}`],
              },
            })),
            cacheHint: {
              tags: ["grammar-points"],
            },
          };
        }
        const entries = await fetchAllGrammarPoints(filter.context);
        return {
          entries: entries.map((entry) => ({
            id: entry.id,
            data: entry,
            cacheHint: {
              tags: [`grammar-point-${entry.id}`],
            },
          })),
          cacheHint: {
            tags: ["grammar-points"],
          },
        };
      } catch (error) {
        console.error("Error loading grammar points:", error);
        return {
          error:
            error instanceof Error
              ? error
              : new Error("Failed to load grammar points", { cause: error }),
        };
      }
    },
    loadEntry: async ({ filter: { id, context } }) => {
      try {
        const entry = await fetchGrammarPoint(id, context);
        if (!entry) {
          return {
            error: new Error(`Grammar point with id ${id} not found`),
          };
        }
        return {
          id: entry.id,
          data: entry,
          cacheHint: {
            tags: [`grammar-point-${entry.id}`],
          },
        };
      } catch (error) {
        console.error(`Error loading grammar point with id ${id}:`, error);
        return {
          error:
            error instanceof Error
              ? error
              : new Error(`Failed to load grammar point with id ${id}`, {
                  cause: error,
                }),
        };
      }
    },
  };
}

const grammarPoints = defineLiveCollection({
  loader: grammarPointsLoader(),
});

export const collections = { grammarPoints };
