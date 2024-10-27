import { GrammarPoint } from "./types/GrammarPoint";
import type { GrammarPointDto } from "./types/dto";
import { fetchJson } from "./utils";

/**
 * TODO:
 * due to limitations of the firestore (available only in node.js)
 * I can't use new method in the Exercise component
 * I will delegate Firestore to the backend anyway
 */
export const fetchGrammarPointFromApi = async (
	id: string,
): Promise<GrammarPoint | undefined> => {
	const dto = await fetchJson<GrammarPointDto | undefined>(
		`${import.meta.env.PUBLIC_API}grammar/${id}`,
	);
	return dto && GrammarPoint(dto);
};

export const fetchGrammarFromApi = async (): Promise<GrammarPoint[]> => {
	const grammarDto: GrammarPointDto[] = await fetchJson(
		`${import.meta.env.PUBLIC_API}/grammar`,
	);

	return grammarDto
		.map(GrammarPoint)
		.toSorted(
			(a, b) =>
				(a.order ?? Number.MAX_SAFE_INTEGER) -
				(b.order ?? Number.MAX_SAFE_INTEGER),
		);
};
