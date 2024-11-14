import type { User } from "../../../models/user";
import { fetchGrammarList } from "@grammar-sdk";
import { NaiveAlgorithm } from "./NaiveAlgorithm";
import { SpaceRepetition } from "./SpaceRepetition";
import { getAttempts, saveAttempt } from "./SpaceRepetitionRepository";
import { StageSettings } from "./StageSettings";
import type { Attempt } from "./types/Attempt";
import type { Lesson } from "./types/Lesson";
import type { Schedule } from "./types/Schedule";
import { db } from "libs/db";
import { Seq, Map as IMap } from "immutable";
import { diffDays } from "@formkit/tempo";

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

export const countStreak = async (user: User): Promise<number> => {
  const attempts = await getAttempts(db, user);
  return (
    Seq(attempts)
      .sort((a, b) => +b.answeredAt - +a.answeredAt)
      .takeWhile((a, k, iter) => {
        const prev = iter.get(k - 1);
        if (!prev) return true;
        return diffDays(a.answeredAt, prev.answeredAt) <= 1;
      }).size ?? 0
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
