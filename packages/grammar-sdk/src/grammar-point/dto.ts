import type { GrammarPoint } from "../..";
import type {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
  grammarPointsTmp,
} from "../../../../libs/db/schema-tmp";
import type { ExercisePart } from "../exercise";

export type GrammarPointDb = typeof grammarPointsTmp.$inferSelect & {
  exercises: (typeof exercisesTmp.$inferSelect & {
    parts: (typeof exercisePartsTmp.$inferSelect & {
      acceptableAnswers?: (typeof acceptableAnswersTmp.$inferSelect)[];
    })[];
  })[];
};

export const GrammarPointDb = {
  toGrammarPoint: (g: GrammarPointDb): GrammarPoint => {
    const exercises = g.exercises.map((e) => ({
      ru: e.parts
        .filter((p) => p.language === "ru")
        .toSorted((a, b) => a.order - b.order)
        .map((p) => p.text) as [string, string, string],
      en: e.parts
        .filter((p) => p.language === "en")
        .toSorted((a, b) => a.order - b.order)
        .map((p) => p.text) as [string, string, string],
      order: e.order,
    }));

    return {
      id: `${g.id}`,
      shortTitle: g.shortTitle,
      order: g.order,
      torfl: g.torfl ?? "Coming soon",
      detailedTitle: g.detailedTitle ?? undefined,
      englishTitle: g.englishTitle ?? undefined,
      structure: g.structure ?? undefined,
      examples: exercises,
      explanation: g.explanation ?? undefined,
      exercises: g.exercises.map((e) => ({
        id: e.id,
        grammarPointId: e.grammarPointId.toString(),
        order: e.order,
        hide: e.hide,
        parts: e.parts
          .filter((p) => p.language === "ru")
          .toSorted((a, b) => a.order - b.order)
          .map(partFromDB),
        translationParts: e.parts
          .filter((p) => p.language === "en")
          .toSorted((a, b) => a.order - b.order)
          .map(partFromDB),
      })),
      hidden: g.hide,
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

const partFromDB = (
  p: GrammarPointDb["exercises"][number]["parts"][number],
): ExercisePart => {
  if (p.type === "text") {
    return {
      id: p.id,
      index: p.order,
      type: p.type,
      text: p.text,
    };
  }
  return {
    id: p.id,
    index: p.order,
    type: p.type,
    text: p.text,
    description: p.description ?? undefined,
    acceptableAnswers:
      p.acceptableAnswers?.map((ans) => ({
        text: ans.text,
        description: ans.description ?? undefined,
        variant: ans.variant,
      })) ?? [],
  };
};
