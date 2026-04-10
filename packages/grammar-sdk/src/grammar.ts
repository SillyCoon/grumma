import type { Context } from "./context";
import { getGrammarPoint, getGrammarPoints } from "./db";
import { GrammarPoint, GrammarPoints } from "./grammar-point";

export const fetchGrammarPoint = async (
  id: string,
  context: Context,
): Promise<GrammarPoint | undefined> => {
  const maybeGrammarPoint = await getGrammarPoint(+id);
  return (
    maybeGrammarPoint && GrammarPoint.filterVisible(maybeGrammarPoint, context)
  );
};

export const fetchGrammarPoints = async (
  ids: string[],
  context: Context,
): Promise<GrammarPoint[]> => {
  return GrammarPoints.filterVisible(
    await getGrammarPoints(ids.map((id) => +id)),
    context,
  );
};

export const fetchAllGrammarPoints = async (
  context: Context,
): Promise<GrammarPoint[]> => {
  const grammarPoints = await getGrammarPoints();
  return GrammarPoints.filterVisible(grammarPoints, context);
};

export {
  createGrammarPoint,
  updateGrammarPoint,
  updateGrammarPointsOrder,
  putExercises,
} from "./db";
