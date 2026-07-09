import type { GrammarPoint } from "../..";
import type { grammarPointsTmp, labels } from "../../../../libs/db/schema-tmp";

export type GrammarPointDb = typeof grammarPointsTmp.$inferSelect & {
  labelsToGrammarPoints: {
    label: typeof labels.$inferSelect;
  }[];
};

export const GrammarPointDb = {
  toGrammarPoint: (g: GrammarPointDb): GrammarPoint => {
    return {
      id: `${g.id}`,
      shortTitle: g.shortTitle,
      order: g.order,
      torfl: g.torfl ?? "Coming soon",
      detailedTitle: g.detailedTitle ?? undefined,
      englishTitle: g.englishTitle ?? undefined,
      structure: g.structure ?? undefined,
      explanation: g.explanation ?? undefined,
      labels: g.labelsToGrammarPoints.map((l) => l.label.id),
      hide: g.hide,
    };
  },
};

export const GrammarPointsDb = {
  toGrammarPoints: (gs: GrammarPointDb[]): GrammarPoint[] => {
    return gs
      .map(GrammarPointDb.toGrammarPoint)
      .toSorted(
        (a, b) =>
          (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER),
      );
  },
};
