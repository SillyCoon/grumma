import { isBefore } from "@formkit/tempo";
import type { Attempt } from "./types/Attempt";
import type { Stage } from "./types/Stage";
import type { Schedule } from "./types/Schedule";
import type { GrammarPoint } from "grammar-sdk";

export interface Settings {
  stageMinutes: Record<Stage, number>;
  stageDowngradeMultiplier: number;
}

export interface Repetition {
  grammarPointId: string;
  stage: Stage;
  availableAt: Date;
}

export interface RepetitionAlgorithm {
  getSchedule(attempts: Attempt[], settings?: Settings): Schedule;
}

export const calculateExerciseOrderByStage = (
  exercisesNumber: number,
  stage: Stage,
) => {
  return stage >= exercisesNumber ? stage % exercisesNumber : stage;
};

interface SpaceRepetition {
  repeatingGrammarPoints(): string[];
  nextGrammarPointsForLessons(
    amount: number,
    grammarPoints: GrammarPoint[],
  ): GrammarPoint[];
  getSchedule(algorithm: RepetitionAlgorithm, settings: Settings): Schedule;
  nextRound(algorithm: RepetitionAlgorithm, settings: Settings): Repetition[];
}

export const SpaceRepetition = (attempts: Attempt[]): SpaceRepetition => {
  const repeatingGrammarPoints = () => {
    return Array.from(new Set(attempts.map((t) => t.grammarPointId)).values());
  };

  const nextGrammarPointsForLessons = (
    amount: number,
    grammarPoints: GrammarPoint[],
  ): GrammarPoint[] => {
    const reviewMap = new Map(repeatingGrammarPoints().map((r) => [r, true]));
    const gpNotInReview = grammarPoints.filter((gp) => !reviewMap.has(gp.id));

    const result = gpNotInReview
      .toSorted(
        (a, b) =>
          (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER),
      )
      .slice(0, amount);
    return result;
  };

  const getSchedule = (algorithm: RepetitionAlgorithm, settings: Settings) => {
    return algorithm.getSchedule(attempts, settings);
  };

  const nextRound = (algorithm: RepetitionAlgorithm, settings: Settings) => {
    const schedule = algorithm.getSchedule(attempts, settings);
    return schedule.filter((r) => isBefore(r.availableAt, new Date()));
  };

  return {
    repeatingGrammarPoints,
    nextGrammarPointsForLessons,
    getSchedule,
    nextRound,
  };
};
