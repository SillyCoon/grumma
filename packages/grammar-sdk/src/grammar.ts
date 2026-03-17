import { createSupabaseClientInstance } from "../../../libs/supabase";
import {
  fetchGrammarFromDb,
  fetchGrammarPointFromDb,
  fetchGrammarPointsFromDb,
} from "./db";
import type { GrammarPoint } from "./types/GrammarPoint";

export const fetchGrammarPoint = async (
  id: string,
): Promise<GrammarPoint | undefined> => {
  const gp = await fetchGrammarPointFromDb(id);
  const explanation = await fetchExplanation(id);
  return gp ? { ...gp, explanation } : undefined;
};

export const fetchGrammarPoints = async (
  ids: string[],
): Promise<GrammarPoint[]> => {
  const gp = await fetchGrammarPointsFromDb(ids.map((id) => +id));
  return Promise.all(
    gp.map(async (g) => {
      const explanation = await fetchExplanation(g.id);
      return { ...g, explanation };
    }),
  );
};

/**
 *
 * @returns All grammar WITHOUT explanations
 */
export const fetchGrammarList = async (): Promise<GrammarPoint[]> => {
  return fetchGrammarFromDb();
};

export const fetchExplanation = async (grammarPointId: string | number) => {
  const supabase = createSupabaseClientInstance();

  const url = supabase.storage
    .from("explanations")
    .getPublicUrl(`SON-${grammarPointId}.html`).data.publicUrl;

  const response = await fetch(url);
  if (response.ok) {
    return await response.text();
  }
  return undefined;
};
