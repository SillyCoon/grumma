import type { GrammarPointWithLabels } from "./type";

export const searchGrammar = (
  grammarPoints: GrammarPointWithLabels[],
  query: string,
) => {
  const strategies = buildStrategiesFrom(query);
  return strategies.reduce(
    (result, strategy) => strategy.apply(result),
    grammarPoints,
  );
};

type SearchStrategy = {
  apply: (grammar: GrammarPointWithLabels[]) => GrammarPointWithLabels[];
};

type Keyword = "order" | "short" | "detailed" | "english" | "torfl" | "label";
const keywords: Keyword[] = [
  "order",
  "short",
  "detailed",
  "english",
  "torfl",
  "label",
];
type KeywordQuery = `${Keyword}:${string}`;

const isKeywordQuery = (query: string): query is KeywordQuery => {
  return keywords.some((keyword) =>
    query.toLowerCase().startsWith(`${keyword}:`),
  );
};

// TODO: add support for "and" / "or" and search with quotes to include spaces, e.g. label:"no description"
const buildStrategiesFrom = (query: string): SearchStrategy[] => {
  const processedQuery = query.trim().toLowerCase().replaceAll(/\s+/g, " ");
  const splitted = processedQuery.split(" ");
  const plainTextQueries = splitted.filter((part) => !isKeywordQuery(part));
  const keywordQueries = splitted.filter(isKeywordQuery);

  const plainStrategies = plainTextQueries.map(PlainTextQuery);
  const keywordStrategies = keywordQueries.map(KeywordBasedQuery);

  return [...plainStrategies, ...keywordStrategies];
};

const PlainTextQuery: (query: string) => SearchStrategy = (query) => ({
  apply: (grammar: GrammarPointWithLabels[]) =>
    grammar.filter((gp) => {
      return (
        gp.order.toString() === query ||
        gp.shortTitle.toLowerCase().includes(query) ||
        gp.detailedTitle?.toLowerCase().includes(query) ||
        gp.englishTitle?.toLowerCase().includes(query) ||
        gp.torfl?.toLowerCase() === query ||
        gp.labels.some((label) => label.name.toLowerCase().includes(query))
      );
    }),
});

const KeywordBasedQuery: (query: KeywordQuery) => SearchStrategy = (query) => ({
  apply: (grammar: GrammarPointWithLabels[]) => {
    const [keyword, ...rest] = query.split(":");
    const value = rest.join(":"); // In case the value contains ":"

    switch (keyword) {
      case "order":
        return grammar.filter((gp) => gp.order.toString() === value);
      case "short":
        return grammar.filter((gp) =>
          gp.shortTitle.toLowerCase().includes(value),
        );
      case "detailed":
        return grammar.filter((gp) =>
          gp.detailedTitle?.toLowerCase().includes(value),
        );
      case "english":
        return grammar.filter((gp) =>
          gp.englishTitle?.toLowerCase().includes(value),
        );
      case "torfl":
        return grammar.filter((gp) => gp.torfl?.toLowerCase() === value);
      case "label":
        return grammar.filter((gp) =>
          gp.labels.some((label) => label.name.toLowerCase().includes(value)),
        );
      default:
        return grammar; // If the keyword is not recognized, return the original list
    }
  },
});
