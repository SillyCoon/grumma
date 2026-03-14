import { Context } from "../context";
import { FullExamples, type Example, type FullExample } from "../example";
import { Exercises, type Exercise } from "../exercise";

export interface GrammarPoint {
  id: string;
  shortTitle: string;
  order: number;
  hide: boolean;

  examples: FullExample[];
  exercises: Exercise[];

  torfl?: string;
  detailedTitle?: string;
  englishTitle?: string;
  structure?: string;
  explanation?: string;
}

export const GrammarPoint = {
  isVisible(gp: GrammarPoint, context: Context) {
    return !gp.hide || Context.isAdmin(context);
  },
};

export const GrammarPoints = {
  filterVisible(grammarPoints: GrammarPoint[], context: Context) {
    const filteredGrammar = grammarPoints.filter((gp) =>
      GrammarPoint.isVisible(gp, context),
    );
    return filteredGrammar.map((gp) => ({
      ...gp,
      exercises: Exercises.filterVisible(gp.exercises, context),
      examples: FullExamples.filterVisible(gp.examples, context),
    }));
  },
};
