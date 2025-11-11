import { fetchGrammarList } from "grammar-sdk";
import { Map as IMap, Seq } from "immutable";
import { db } from "../../libs/db";
import type { User } from "../../src/models/user";
import { NaiveAlgorithm } from "./src/NaiveAlgorithm";
import { Session } from "./src/session";
import { SpaceRepetition } from "./src/SpaceRepetition";
import {
  addToRepetitions,
  getAttempts,
  getSession,
  removeFromRepetitions,
  saveAttempt,
} from "./src/SpaceRepetitionRepository";
import { StageSettings } from "./src/StageSettings";
import type { Attempt } from "./src/types/Attempt";
import type { Lesson } from "./src/types/Lesson";
import type { Schedule } from "./src/types/Schedule";
import { countStreak as countStreakUtils } from "./src/utils";

const algorithm = NaiveAlgorithm;
const settings = {
  stageDowngradeMultiplier: 2,
  stageMinutes: StageSettings,
};

export const getLessons = async (
  amount: number,
  user: User,
): Promise<Lesson[]> => {
  const grammarPoints = await fetchGrammarList();
  const attempts = await getAttempts(db, user);

  const spaceRepetition = SpaceRepetition(attempts);
  return spaceRepetition.nextLessons(amount, grammarPoints);
};

export const addAttempt = async (
  attempt: Attempt,
  user: User,
): Promise<void> => {
  await saveAttempt(db, attempt, user);
};

export const getNextRound = async (user: User): Promise<Lesson[]> => {
  const attempts = await getAttempts(db, user);
  const grammarPoints = await fetchGrammarList();

  const spaceRepetition = SpaceRepetition(attempts);
  const nextRound = spaceRepetition.nextRound(
    algorithm,
    settings,
    grammarPoints,
  );

  return nextRound;
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
  const grammar = await fetchGrammarList();

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

export type { Attempt } from "./src/types/Attempt";
export type { Lesson } from "./src/types/Lesson";
export type { Schedule } from "./src/types/Schedule";
export type { Stage } from "./src/types/Stage";

export { addToRepetitions, removeFromRepetitions };
