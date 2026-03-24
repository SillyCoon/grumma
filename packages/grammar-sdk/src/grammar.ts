import { createSupabaseClientInstance } from "../../../libs/supabase";
import type { Context } from "./context";
import { getGrammarPoint, getGrammarPoints } from "./db";
import { GrammarPoint, GrammarPoints } from "./grammar-point";

export const fetchGrammarPoint = async (
  id: string,
  context: Context,
): Promise<GrammarPoint | undefined> => {
  const grammarPoint = await getGrammarPoint(+id);
  if (grammarPoint && !GrammarPoint.filterVisible(grammarPoint, context)) {
    return undefined;
  }
  return grammarPoint;
};

export const fetchGrammarPoints = async (
  ids: string[],
  context: Context,
): Promise<GrammarPoint[]> => {
  const grammarPoints = await getGrammarPoints(ids.map((id) => +id));
  return GrammarPoints.filterVisible(grammarPoints, context);
};

/**
 *
 * @returns All grammar WITHOUT explanations
 */
export const fetchAllGrammarPoints = async (
  context: Context,
): Promise<GrammarPoint[]> => {
  const grammarPoints = await getGrammarPoints();
  return GrammarPoints.filterVisible(grammarPoints, context);
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
