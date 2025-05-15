import type { Example } from "../example";
import type { Exercise } from "./Exercise";

export interface GrammarPoint {
  id: string;
  shortTitle: string;
  order: number;
  torfl: string;

  examples: {
    ru: Example;
    en: Example;
    order: number;
  }[];
  exercises: Exercise[];

  detailedTitle?: string;
  englishTitle?: string;
  structure?: string;
  explanation?: string;
}
