import { type GrammarPoint, GrammarPointFromDB } from "./types/GrammarPoint";
import { db } from "libs/db";
import { grammarPoints } from "libs/db/schema";
import { eq } from "drizzle-orm";

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
