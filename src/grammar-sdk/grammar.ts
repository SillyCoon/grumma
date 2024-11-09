import { fetchGrammarFromDb, fetchGrammarPointFromDb } from "./db";
import { fetchGrammarFromApi, fetchGrammarPointFromApi } from "./realtime";

export const fetchGrammarPoint = (id: string) => {
	return import.meta.env.PUBLIC_REAL_TIME_CONTENT_UPDATE
		? fetchGrammarPointFromApi(id)
		: fetchGrammarPointFromDb(id);
};

export const fetchGrammar = () => {
	return import.meta.env.PUBLIC_REAL_TIME_CONTENT_UPDATE
		? fetchGrammarFromApi()
		: fetchGrammarFromDb();
};
