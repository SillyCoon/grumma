import type { Example } from "./Example";
import type { Exercise } from "./Exercise";

export interface GrammarPoint {
	id: string;
	title: string;
	structure: string;
	examples: {
		ru: Example;
		en: Example;
	}[];
	order?: number;
	exercises: Exercise[];
	torfl: string;
}
