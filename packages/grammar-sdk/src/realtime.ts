import { Example } from "./example";
import type { GrammarPointDto } from "./types/dto";
import type { GrammarPoint } from "./types/GrammarPoint";
import { extractGrammar, fetchJson } from "./utils";

export const fetchGrammarPointFromApi = async (
  id: string,
): Promise<GrammarPoint | undefined> => {
  console.log("fetchGrammarPointFromApi", process.env.PUBLIC_API, id);
  const dto = await fetchJson<GrammarPointDto | undefined>(
    `${process.env.PUBLIC_API}/grammar/${id}`,
  );
  return dto && GrammarPointFromRealtime(dto);
};

export const fetchGrammarFromApi = async (): Promise<GrammarPoint[]> => {
  const grammarDto: GrammarPointDto[] = await fetchJson(
    `${process.env.PUBLIC_API}/grammar`,
  );

  return grammarDto
    .map(GrammarPointFromRealtime)
    .toSorted(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER),
    );
};

const GrammarPointFromRealtime = (g: GrammarPointDto): GrammarPoint => {
  return {
    id: `${g.id.number}`,
    shortTitle: g.shortTitle ?? "",
    detailedTitle: g.detailedTitle ?? "",
    englishTitle: g.englishTitle ?? "",
    structure: g.structure,
    order: g.order ?? 0,
    examples: g.exercises.map((e, i) => ({
      ru: Example(e.ru),
      en: Example(e.en),
      order: i,
    })),
    exercises: g.exercises.map((e, i) => ({
      grammarPointId: `${g.id.number}`,
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
