import { isBefore } from "@formkit/tempo";
import type { Attempt } from "./types/Attempt";
import { Lesson } from "./types/Lesson";
import type { Stage } from "./types/Stage";
import type { Schedule } from "./types/Schedule";
import type { GrammarPoint } from "@grammar-sdk";

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

interface SpaceRepetition {
	repeatingGrammarPoints(): string[];
	nextLessons(amount: number, grammar: GrammarPoint[]): Lesson[];
	getSchedule(algorithm: RepetitionAlgorithm, settings: Settings): Schedule;
	nextRound(
		algorithm: RepetitionAlgorithm,
		settings: Settings,
		grammar: GrammarPoint[],
	): Lesson[];
}

export const SpaceRepetition = (attempts: Attempt[]): SpaceRepetition => {
	const repeatingGrammarPoints = () => {
		return Array.from(new Set(attempts.map((t) => t.grammarPointId)).values());
	};

	const nextLessons = (amount: number, grammar: GrammarPoint[]): Lesson[] => {
		const reviewMap = new Map(repeatingGrammarPoints().map((r) => [r, true]));
		const gpNotInReview = grammar.filter((gp) => !reviewMap.get(gp.id));

		const result = gpNotInReview
			.toSorted(
				(a, b) =>
					(a.order ?? Number.MAX_SAFE_INTEGER) -
					(b.order ?? Number.MAX_SAFE_INTEGER),
			)
			.slice(0, amount)
			.map(Lesson)
			.filter((v): v is Lesson => !!v);
		return result;
	};

	const getSchedule = (algorithm: RepetitionAlgorithm, settings: Settings) => {
		return algorithm.getSchedule(attempts, settings);
	};

	const nextRound = (
		algorithm: RepetitionAlgorithm,
		settings: Settings,
		grammar: GrammarPoint[],
	): Lesson[] => {
		const schedule = algorithm.getSchedule(attempts, settings);

		return schedule
			.filter((r) => isBefore(r.availableAt, new Date()))
			.map((r) => {
				const gp = grammar.find((gp) => gp.id === r.grammarPointId);

				if (!gp) return;
				const { exercises, ...info } = gp;

				return {
					...info,
					exercise: exercises[r.stage],
				};
			})
			.filter((v): v is Lesson => !!v);
	};

	return {
		repeatingGrammarPoints,
		nextLessons,
		getSchedule,
		nextRound,
	};
};
