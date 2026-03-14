import { Context } from "../context";
import type { Example } from "../example";
import type { Exercise } from "../exercise";

export interface GrammarPoint {
  id: string;
  shortTitle: string;
  order: number;
  hidden: boolean;

  examples: {
    ru: Example;
    en: Example;
    order: number;
  }[];
  exercises: Exercise[];

  torfl?: string;
  detailedTitle?: string;
  englishTitle?: string;
  structure?: string;
  explanation?: string;
}

export const GrammarPoint = {
  isVisible(gp: GrammarPoint, context: Context) {
    return !gp.hidden || Context.isAdmin(context);
  },
};

export const GrammarPoints = {
  // TODO: filter out exercises and examples that are hidden
  filterVisible(grammarPoints: GrammarPoint[], context: Context) {
    return grammarPoints.filter((gp) => GrammarPoint.isVisible(gp, context));
  },
};
