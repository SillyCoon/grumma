import { createSupabaseClientInstance } from "../../../libs/supabase";
import type { Context } from "./context";
import { getGrammarPoint, getGrammarPoints } from "./db";
import type { GrammarPoint } from "./types/GrammarPoint";

export const fetchGrammarPoint = async (
  id: string,
  context: Context,
): Promise<GrammarPoint | undefined> => {
  const gp = await getGrammarPoint(id);
  const explanation = await fetchExplanation(id);
  return gp ? { ...gp, explanation } : undefined;
};

export const fetchGrammarPoints = async (
  ids: string[],
  context: Context,
): Promise<GrammarPoint[]> => {
  const gp = await getGrammarPoints(ids.map((id) => +id));
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
export const fetchAllGrammarPoints = async (
  context: Context,
): Promise<GrammarPoint[]> => {
  return getGrammarPoints();
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
