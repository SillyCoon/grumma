import type { Context } from "./context";
import { getGrammarPoint, getGrammarPoints } from "./db";
import { GrammarPoint, GrammarPoints } from "./grammar-point";

export const fetchGrammarPoint = async (
  id: string,
  context: Context,
): Promise<GrammarPoint | undefined> => {
  const grammarPoint = await getGrammarPoint(+id);
  if (grammarPoint && !GrammarPoint.isVisible(grammarPoint, context)) {
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

export const fetchAllGrammarPoints = async (
  context: Context,
): Promise<GrammarPoint[]> => {
  const grammarPoints = await getGrammarPoints();
  return GrammarPoints.filterVisible(grammarPoints, context);
};

export { createGrammarPoint, updateGrammarPoint } from "./db";
