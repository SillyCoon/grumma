import type { GrammarPoint } from "../..";
import type {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
  grammarPointsTmp,
} from "../../../../libs/db/schema-tmp";
import { ExerciseDb } from "../exercise/dto";

export type GrammarPointDb = typeof grammarPointsTmp.$inferSelect & {
  exercises: (typeof exercisesTmp.$inferSelect & {
    parts: (typeof exercisePartsTmp.$inferSelect & {
      acceptableAnswers?: (typeof acceptableAnswersTmp.$inferSelect)[];
    })[];
  })[];
};

const makeExample = (parts: GrammarPointDb["exercises"][number]["parts"]) =>
  parts
    .toSorted((a, b) => a.order - b.order)
    .map((p) => p.text)
    .concat(new Array(3).fill(""))
    .slice(0, 3) as [string, string, string];

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
      examples: g.exercises.map((e) => ({
        ru: makeExample(e.parts.filter((p) => p.language === "ru")),
        en: makeExample(e.parts.filter((p) => p.language === "en")),
        order: e.order,
        hide: e.hide,
      })),
      explanation: g.explanation ?? undefined,
      exercises: g.exercises.map((e) => ExerciseDb.toExercise(e)),
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
