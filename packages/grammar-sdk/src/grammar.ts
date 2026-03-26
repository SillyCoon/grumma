import { createSupabaseClientInstance } from "../../../libs/supabase";
import { Context } from "./context";
import { getGrammarPoint, getGrammarPoints } from "./db";
import {
  getGrammarPoint as getGrammarPointNew,
  getGrammarPoints as getGrammarPointsNew,
} from "./db-new";
import { GrammarPoint, GrammarPoints } from "./grammar-point";

export const fetchGrammarPoint = async (
  id: string,
  context: Context,
): Promise<GrammarPoint | undefined> => {
  if (Context.isAdmin(context)) {
    const maybeGrammarPoint = await getGrammarPointNew(+id);
    return (
      maybeGrammarPoint &&
      GrammarPoint.filterVisible(maybeGrammarPoint, context)
    );
  }
  const grammarPoint = await getGrammarPoint(+id);
  const explanation = await fetchExplanation(id); // TODO: remove this when explanations are moved to DB
  if (grammarPoint) {
    grammarPoint.explanation = explanation;
  }
  return grammarPoint && GrammarPoint.filterVisible(grammarPoint, context);
};

export const fetchGrammarPoints = async (
  ids: string[],
  context: Context,
): Promise<GrammarPoint[]> => {
  if (Context.isAdmin(context)) {
    return GrammarPoints.filterVisible(
      await getGrammarPointsNew(ids.map((id) => +id)),
      context,
    );
  }
  const grammarPoints = await getGrammarPoints(ids.map((id) => +id));
  const result = await Promise.all(
    grammarPoints.map(async (gp) => {
      const e = await fetchExplanation(gp.id);
      return { ...gp, explanation: e };
    }), // TODO: remove this when explanations are moved to DB
  );
  return GrammarPoints.filterVisible(result, context);
};

/**
 *
 * @returns All grammar WITHOUT explanations
 */
export const fetchAllGrammarPoints = async (
  context: Context,
): Promise<GrammarPoint[]> => {
  const grammarPoints = Context.isAdmin(context)
    ? await getGrammarPointsNew()
    : await getGrammarPoints();
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
