import type { Context } from "./context";
import { createSupabaseClientInstance } from "../../../libs/supabase";
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
  if (grammarPoint && !GrammarPoint.filterVisible(grammarPoint, context)) {
    return undefined;
  }
  return grammarPoint;
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
  return GrammarPoints.filterVisible(grammarPoints, context);
};

export const fetchAllGrammarPoints = async (
  context: Context,
): Promise<GrammarPoint[]> => {
  const grammarPoints = Context.isAdmin(context)
    ? await getGrammarPointsNew()
    : await getGrammarPoints();
  return GrammarPoints.filterVisible(grammarPoints, context);
};

export {
  createGrammarPoint,
  updateGrammarPoint,
  updateGrammarPointsOrder,
  putExercises,
} from "./db";
