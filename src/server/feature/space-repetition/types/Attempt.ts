import type { Stage } from "./Stage";

export type Attempt = {
	grammarPointId: string;
	stage: Stage;
	answer: string;
	isCorrect: boolean;
	answeredAt: Date;
	reviewSessionId: string;
};
