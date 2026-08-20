import {
  fetchAllGrammarPoints,
  fetchExercisesByGrammarPointId,
  fetchExercisesByGrammarPointIds,
  fetchGrammarPoints,
  type Exercise,
} from "grammar-sdk";
import { Map as IMap, Seq } from "immutable";
import { db } from "db";
import { Context, type User } from "auth";
import { NaiveAlgorithm } from "./src/NaiveAlgorithm";
import { Session } from "./src/session";
import {
  calculateExerciseOrderByStage,
  SpaceRepetition,
} from "./src/SpaceRepetition";
import {
  addToRepetitions,
  getAttempts,
  getSession,
  removeFromRepetitions,
  saveAttempt,
} from "./src/SpaceRepetitionRepository";
import { MockStageSettings, StageSettings } from "./src/StageSettings";
import type { Attempt } from "./src/types/Attempt";
import { Lesson } from "./src/types/Lesson";
import type { Schedule } from "./src/types/Schedule";
import { countStreak as countStreakUtils } from "./src/utils";
import type { Round } from "./src/types/Round";
import type { Stage } from "./src/types/Stage";

const algorithm = NaiveAlgorithm;
const settings = {
  stageDowngradeMultiplier: 2,
  stageMinutes: import.meta.env.MOCK_STAGE_SETTINGS
    ? MockStageSettings
    : StageSettings,
};

export const getLessons = async (
  amount: number,
  user: User,
): Promise<Lesson[]> => {
  const attempts = await getAttempts(db, user);

  const grammarPoints = await fetchAllGrammarPoints(Context.fromUser(user));

  const spaceRepetition = SpaceRepetition(attempts);
  const nextGrammarPoints = spaceRepetition.nextGrammarPointsForLessons(
    amount,
    grammarPoints,
  );
  return Promise.all(
    nextGrammarPoints.map(async (gp) => {
      const exercises = await fetchExercisesByGrammarPointId(
        gp.id,
        Context.fromUser(user),
      );
      return Lesson({ ...gp, exercises });
    }),
  ).then((lessons) => lessons.filter((l): l is Lesson => !!l));
};

export const addAttempt = async (
  attempt: Attempt,
  user: User,
): Promise<void> => {
  await saveAttempt(db, attempt, user);
};

export const getNextRound = async (user: User): Promise<Round[]> => {
  const attempts = await getAttempts(db, user);

  const spaceRepetition = SpaceRepetition(attempts);
  const nextRound = spaceRepetition.nextRound(algorithm, settings);

  const grammarPoints = await fetchGrammarPoints(
    nextRound.map((r) => r.grammarPointId),
    Context.fromUser(user),
  );

  const exercises = await fetchExercisesByGrammarPointIds(
    nextRound.map((r) => r.grammarPointId),
    Context.fromUser(user),
  );

  return grammarPoints
    .toSorted((a, b) => a.order - b.order)
    .map((gp) => {
      const round = nextRound.find((r) => r.grammarPointId === gp.id);
      const sortedExercises = exercises[gp.id]?.sort(
        (a, b) => a.order - b.order,
      );
      if (!round || !sortedExercises) {
        console.warn(
          `Round or exercises not found for grammar point ${gp.id}`,
          round,
          sortedExercises,
        );
        return undefined;
      }

      const nextExercise =
        sortedExercises[
          calculateExerciseOrderByStage(sortedExercises.length, round.stage)
        ];

      if (!nextExercise) {
        console.warn(
          `Next exercise not found for grammar point ${gp.id} and stage ${round.stage}`,
          sortedExercises,
        );
        return undefined;
      }

      return {
        exercise: nextExercise,
        stage: round.stage,
      };
    })
    .filter((v): v is { exercise: Exercise; stage: Stage } => !!v);
};

export const countNextRound = async (user: User): Promise<number> => {
  return (await getNextRound(user)).length;
};

export const countStreak = async (
  today: Date,
  timezone: string,
  user: User,
): Promise<number> => {
  const attempts = await getAttempts(db, user);
  return countStreakUtils(
    today,
    timezone,
    attempts.map((v) => v.answeredAt),
  );
};

export const getInReviewByTorfl = async (user: User) => {
  const schedule = await getSchedule(user);
  const grammar = await fetchAllGrammarPoints(Context.fromUser(user));

  const grammarPointsById = IMap(grammar.map((v) => [v.id, v]));

  const totalTorfl = Seq(grammar)
    .map((v) => v.torfl)
    .countBy((v) => v)
    .toArray();

  const inReviewByTorfl = Seq(schedule)
    .map((s) => grammarPointsById.get(s.grammarPointId))
    .countBy((v) => v?.torfl);

  return totalTorfl.map(([torfl, total]) => ({
    torfl,
    count: inReviewByTorfl.get(torfl, 0),
    total,
  }));
};

export const getSchedule = async (user: User): Promise<Schedule> => {
  const attempts = await getAttempts(db, user);
  const spaceRepetition = SpaceRepetition(attempts);
  return spaceRepetition.getSchedule(algorithm, settings);
};

export const listGrammarPointsInReview = async (
  user: User,
): Promise<string[]> => {
  const attempts = await getAttempts(db, user);
  const spaceRepetition = SpaceRepetition(attempts);
  return spaceRepetition.repeatingGrammarPoints();
};

export const getSessionResult = async (user: User, sessionId: string) => {
  const session = await getSession(db, user, sessionId);
  return Session.calculateResult(session);
};

export * from "./src/types/Attempt";
export type { Lesson } from "./src/types/Lesson";
export type { Schedule } from "./src/types/Schedule";
export type { Stage } from "./src/types/Stage";
export type { GrammarPointReview } from "./src/types/GrammarPointReview";

export { addToRepetitions, removeFromRepetitions };
