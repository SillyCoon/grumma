import type {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
  grammarPointsTmp,
} from "../../../../libs/db/schema-tmp";

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

export type GrammarPointDb = typeof grammarPointsTmp.$inferSelect & {
  exercises: (typeof exercisesTmp.$inferSelect & {
    parts: (typeof exercisePartsTmp.$inferSelect & {
      acceptableAnswers?: (typeof acceptableAnswersTmp.$inferSelect)[];
    })[];
  })[];
};
