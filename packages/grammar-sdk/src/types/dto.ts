import type { InferSelectModel } from "drizzle-orm";

import type { exercises, grammarPoints } from "../../../../libs/db/schema";

interface ExerciseDto {
  en: string;
  ru: string;
  helper: string | null;
}

export interface GrammarPointDto {
  id: {
    number: number;
    prefix?: string;
  };
  shortTitle: string | null;
  detailedTitle: string | null;
  englishTitle: string | null;
  structure: string;
  order?: number;
  exercises: ExerciseDto[];
  torfl: string;
}

export type GrammarPointDb = InferSelectModel<typeof grammarPoints> & {
  exercises: InferSelectModel<typeof exercises>[];
};
