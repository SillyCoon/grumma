import { createSupabaseClientInstance } from "../../../libs/supabase";
import {
  fetchGrammarFromDb,
  fetchGrammarPointFromDb,
  fetchGrammarPointsFromDb,
} from "./db";
import { fetchGrammarFromApi, fetchGrammarPointFromApi } from "./realtime";

export const fetchGrammarPoint = async (id: string) => {
  const gp = process.env.PUBLIC_REAL_TIME_CONTENT_UPDATE
    ? await fetchGrammarPointFromApi(id)
    : await fetchGrammarPointFromDb(id);
  const explanation = await fetchExplanation(id);
  return gp ? { ...gp, explanation } : undefined;
};

export const fetchGrammarPoints = async (ids: string[]) => {
  const gp = await fetchGrammarPointsFromDb(ids.map((id) => +id));
  return Promise.all(
    gp.map(async (g) => {
      const explanation = await fetchExplanation(g.id);
      return { ...g, explanation };
    }),
  );
};

/**
 *
 * @returns All grammar WITHOUT explanations
 */
export const fetchGrammarList = () => {
  return process.env.PUBLIC_REAL_TIME_CONTENT_UPDATE
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
