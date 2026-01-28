export type GrammarPoint = {
  id: number;
  torfl: string | null;
  shortTitle: string;
  order: number;
  structure: string | null;
  detailedTitle: string | null;
  englishTitle: string | null;
  explanation: string | null;
  hide: boolean;
  createdAt: Date;
  updatedAt: Date;
};
