export interface ExerciseDto {
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

export interface GrammarPointDb {
  id: number;
  shortTitle: string | null;
  detailedTitle: string | null;
  englishTitle: string | null;
  structure: string | null;
  order: number | null;
  exercises: ExerciseDto[];
  torfl: string;
}
