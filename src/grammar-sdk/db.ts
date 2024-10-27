import { firestore } from "src/server/firestore";
import { type GrammarPoint, GrammarPointFromDB } from "./types/GrammarPoint";
import type { GrammarPointDtoFromDB } from "./types/dto";

export const fetchGrammarPointFromFirestore = async (
	id: string,
): Promise<GrammarPoint | undefined> => {
	const grammarDto = (
		await firestore.collection("grammar").doc(id).get()
	).data() as GrammarPointDtoFromDB;
	return grammarDto && GrammarPointFromDB(grammarDto);
};

export const fetchGrammarFromFirestore = async (): Promise<GrammarPoint[]> => {
	const grammarDto = (await firestore.collection("grammar").get()).docs.map(
		(d) => d.data(),
	) as GrammarPointDtoFromDB[];

	return grammarDto
		.map(GrammarPointFromDB)
		.toSorted(
			(a, b) =>
				(a.order ?? Number.MAX_SAFE_INTEGER) -
				(b.order ?? Number.MAX_SAFE_INTEGER),
		);
};
