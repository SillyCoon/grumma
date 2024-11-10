import { createSupabaseClientInstance } from "libs/supabase";
import { fetchGrammarFromDb, fetchGrammarPointFromDb } from "./db";
import { fetchGrammarFromApi, fetchGrammarPointFromApi } from "./realtime";

export const fetchGrammarPoint = async (id: string) => {
	const gp = import.meta.env.PUBLIC_REAL_TIME_CONTENT_UPDATE
		? await fetchGrammarPointFromApi(id)
		: await fetchGrammarPointFromDb(id);
	const explanation = await fetchExplanation(id);
	return gp ? { ...gp, explanation } : undefined;
};

export const fetchGrammar = () => {
	return import.meta.env.PUBLIC_REAL_TIME_CONTENT_UPDATE
		? fetchGrammarFromApi()
		: fetchGrammarFromDb();
};

export const fetchExplanation = async (grammarPointId: string | number) => {
	const supabase = createSupabaseClientInstance();

	const url = supabase.storage
		.from("explanations")
		.getPublicUrl(`SON-${grammarPointId}.html`).data.publicUrl;

	return (await fetch(url)).text();
};
