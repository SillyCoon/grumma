import type { GrammarPointDto } from "./types/dto";
import { Example } from "./types/Example";
import type { GrammarPoint } from "./types/GrammarPoint";
import { extractGrammar, fetchJson } from "./utils";

export const fetchGrammarPointFromApi = async (
  id: string,
): Promise<GrammarPoint | undefined> => {
  const dto = await fetchJson<GrammarPointDto | undefined>(
    `${import.meta.env.PUBLIC_API}grammar/${id}`,
  );
  return dto && GrammarPointFromRealtime(dto);
};

export const fetchGrammarFromApi = async (): Promise<GrammarPoint[]> => {
  const grammarDto: GrammarPointDto[] = await fetchJson(
    `${import.meta.env.PUBLIC_API}/grammar`,
  );

  return grammarDto
    .map(GrammarPointFromRealtime)
    .toSorted(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER),
    );
};

export const GrammarPointFromRealtime = (g: GrammarPointDto): GrammarPoint => {
  return {
    id: `${g.id.number}`,
    shortTitle: g.shortTitle ?? "",
    detailedTitle: g.detailedTitle ?? "",
    englishTitle: g.englishTitle ?? "",
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
      draft: e.helper ?? "",
      order: i,
    })),
    torfl: g.torfl,
  };
};
