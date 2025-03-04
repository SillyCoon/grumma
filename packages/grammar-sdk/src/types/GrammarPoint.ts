import type { Example } from "../example";
import type { Exercise } from "./Exercise";

export interface GrammarPoint {
  id: string;
  shortTitle: string;
  detailedTitle: string;
  englishTitle: string;
  structure: string;
  examples: {
    ru: Example;
    en: Example;
    order: number;
  }[];
  order?: number;
  exercises: Exercise[];
  torfl: string;
  explanation?: string;
}
