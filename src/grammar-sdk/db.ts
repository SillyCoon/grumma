import type { GrammarPoint } from "./types/GrammarPoint";
import { db } from "libs/db";
import { grammarPoints } from "libs/db/schema";
import { eq } from "drizzle-orm";
import type { GrammarPointDb } from "./types/dto";
import { Example } from "./types/Example";
import { extractGrammar } from "./utils";

export const fetchGrammarPointFromDb = async (
	id: string,
): Promise<GrammarPoint | undefined> => {
	const grammarDto = await db.query.grammarPoints.findFirst({
		where: eq(grammarPoints.id, +id),
		with: {
			exercises: true,
		},
	});

	return grammarDto && GrammarPointFromDB(grammarDto);
};

export const fetchGrammarFromDb = async (): Promise<GrammarPoint[]> => {
	const grammarDto = await db.query.grammarPoints.findMany({
		with: {
			exercises: true,
		},
	});

	return grammarDto
		.map(GrammarPointFromDB)
		.toSorted(
			(a, b) =>
				(a.order ?? Number.MAX_SAFE_INTEGER) -
				(b.order ?? Number.MAX_SAFE_INTEGER),
		);
};
const GrammarPointFromDB = (g: GrammarPointDb): GrammarPoint => {
	return {
		id: `${g.id}`,
		title: g.title,
		structure: g.structure ?? "",
		order: g.order ?? undefined,
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
			draft: e.helper ?? "",
			order: i,
		})),
		torfl: g.torfl,
	};
};
