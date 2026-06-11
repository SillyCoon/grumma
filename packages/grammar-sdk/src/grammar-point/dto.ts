import type { GrammarPoint } from "../..";
import type {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
  grammarPointsTmp,
  labels,
} from "../../../../libs/db/schema-tmp";
import type { ExercisePart } from "../exercise";
import { ExerciseDb } from "../exercise/dto";

export type GrammarPointDb = typeof grammarPointsTmp.$inferSelect & {
  labelsToGrammarPoints: {
    label: typeof labels.$inferSelect;
  }[];
  exercises: (typeof exercisesTmp.$inferSelect & {
    parts: (typeof exercisePartsTmp.$inferSelect & {
      acceptableAnswers?: (typeof acceptableAnswersTmp.$inferSelect)[];
    })[];
  })[];
};

const makeExample = (parts: ExercisePart[]) =>
  parts
    .toSorted((a, b) => a.index - b.index)
    .map((p) => p.text)
    .concat(new Array(3).fill(""))
    .slice(0, 3) as [string, string, string];

export const GrammarPointDb = {
  toGrammarPoint: (g: GrammarPointDb): GrammarPoint => {
    const exercises = g.exercises.map((e) => ExerciseDb.toExercise(e));

    return {
      id: `${g.id}`,
      shortTitle: g.shortTitle,
      order: g.order,
      torfl: g.torfl ?? "Coming soon",
      detailedTitle: g.detailedTitle ?? undefined,
      englishTitle: g.englishTitle ?? undefined,
      structure: g.structure ?? undefined,
      examples: exercises.map((e) => ({
        ru: makeExample(e.parts),
        en: makeExample(e.translationParts),
        order: e.order,
        hide: e.hide,
      })),
      explanation: g.explanation ?? undefined,
      exercises,
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
