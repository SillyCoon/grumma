import { Example } from "./Example";
import type { Exercise } from "./Exercise";
import type { GrammarPointDto, GrammarPointDtoFromDB } from "./dto";

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
}
export const GrammarPoint = (g: GrammarPointDto): GrammarPoint => {
	return {
		id: `${g.id.number}`,
		title: g.title,
		structure: g.structure,
		order: g.order,
		examples: g.exercises.map((e) => ({
			ru: Example(e.ru),
			en: Example(e.en),
		})),
		exercises: g.exercises.map((e, i) => ({
			grammarPointId: `${g.id.number}`,
			ru: e.ru,
			en: e.en,
			ruGrammar: extractGrammar(e.ru) ?? "",
			enGrammar: extractGrammar(e.en) ?? "",
			draft: e.helper,
			order: i,
		})),
	};
};

export const GrammarPointFromDB = (g: GrammarPointDtoFromDB): GrammarPoint => {
	return {
		id: `${g.id}`,
		title: g.title,
		structure: g.structure,
		order: g.order,
		examples: g.exercises.map((e) => ({
			ru: Example(e.ru),
			en: Example(e.en),
		})),
		exercises: g.exercises.map((e, i) => ({
			grammarPointId: `${g.id}`,
			ru: e.ru,
			en: e.en,
			ruGrammar: extractGrammar(e.ru) ?? "",
			enGrammar: extractGrammar(e.en) ?? "",
			draft: e.helper,
			order: i,
		})),
	};
};

const extractGrammar = (exercise: string) => exercise.match(/%([^%]+)%/)?.[1];
