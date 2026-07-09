import { Context } from "./context";
import {
  getExercisesByGrammarPointId,
  getExercisesByGrammarPointIds,
  getGrammarPoint,
  getGrammarPoints,
} from "./db";
import { type FullExample, FullExamples } from "./example";
import { Exercises, type ExercisesByGrammarPointId } from "./exercise";
import { GrammarPoint, GrammarPoints } from "./grammar-point";

let InMemoryCache: GrammarPoint[] | null = null;
const cacheDuration = 1000 * 60 * 30; // 30 minutes
let cacheTimestamp: number | null = null;

const getFromCache = async (context: Context, ids?: string[]) => {
  if (Context.isAdmin(context)) {
    return null;
  }
  if (
    InMemoryCache &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < cacheDuration
  ) {
    if (ids) {
      return InMemoryCache.filter((gp) => ids.includes(gp.id));
    }
    return InMemoryCache;
  }
  console.log("[GrammarPoints cache] Cache miss or expired");
  return null;
};

const setCache = (grammarPoints: GrammarPoint[]) => {
  InMemoryCache = grammarPoints;
  cacheTimestamp = Date.now();
};

export const clearCache = () => {
  InMemoryCache = null;
  cacheTimestamp = null;
};

export const fetchGrammarPoint = async (
  id: string,
  context: Context,
): Promise<GrammarPoint | undefined> => {
  const cached = await getFromCache(context, [id]);
  if (cached?.at(0)) {
    return GrammarPoint.filterVisible(cached[0], context);
  }
  const maybeGrammarPoint = await getGrammarPoint(+id);
  return (
    maybeGrammarPoint && GrammarPoint.filterVisible(maybeGrammarPoint, context)
  );
};

export const fetchGrammarPoints = async (
  ids: string[],
  context: Context,
): Promise<GrammarPoint[]> => {
  const cached = await getFromCache(context, ids);
  if (cached && cached.length === ids.length) {
    return GrammarPoints.filterVisible(cached, context);
  }
  const grammarPoints = await getGrammarPoints(ids.map((id) => +id));
  return GrammarPoints.filterVisible(grammarPoints, context);
};

export const fetchAllGrammarPoints = async (
  context: Context,
): Promise<GrammarPoint[]> => {
  const cached = await getFromCache(context);

  if (cached) {
    return GrammarPoints.filterVisible(cached, context);
  }

  const grammarPoints = await getGrammarPoints();
  setCache(grammarPoints);
  return GrammarPoints.filterVisible(grammarPoints, context);
};

export const fetchExercisesByGrammarPointId = async (
  grammarPointId: string,
  context: Context,
) => {
  return Exercises.filterVisible(
    await getExercisesByGrammarPointId(+grammarPointId),
    context,
  );
};

export const fetchExamplesByGrammarPointId = async (
  grammarPointId: string,
  context: Context,
): Promise<FullExample[]> => {
  const exercises = await fetchExercisesByGrammarPointId(
    grammarPointId,
    context,
  );

  return FullExamples.fromExercises(exercises);
};

export const fetchExercisesByGrammarPointIds = async (
  grammarPointIds: string[],
  context: Context,
): Promise<ExercisesByGrammarPointId> => {
  const exercises = Exercises.filterVisible(
    await getExercisesByGrammarPointIds(grammarPointIds.map((id) => +id)),
    context,
  );
  return Object.groupBy(exercises, (e) => e.grammarPointId);
};

export {
  createGrammarPoint,
  updateGrammarPoint,
  updateGrammarPointsOrder,
  putExercises,
  createLabel,
  getLabels,
} from "./db";
