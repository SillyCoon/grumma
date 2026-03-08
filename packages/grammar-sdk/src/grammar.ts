import {
  fetchGrammarFromDb,
  fetchGrammarPointFromDb,
  fetchGrammarPointsFromDb,
} from "./db";
import type { GrammarPoint } from "./types/GrammarPoint";

export const fetchGrammarPoint = async (
  id: string,
): Promise<GrammarPoint | undefined> => {
  return fetchGrammarPointFromDb(+id);
};

export const fetchGrammarPoints = async (
  ids: string[],
): Promise<GrammarPoint[]> => {
  return fetchGrammarPointsFromDb(ids.map((id) => +id));
};

export const fetchGrammarList = async (): Promise<GrammarPoint[]> => {
  return fetchGrammarFromDb();
};
