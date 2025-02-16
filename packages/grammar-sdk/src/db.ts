import { eq, inArray } from "drizzle-orm";
import { db } from "../../../libs/db";
import { grammarPoints } from "../../../libs/db/schema";
import type { GrammarPointDb } from "./types/dto";
import { Example } from "./types/Example";
import type { GrammarPoint } from "./types/GrammarPoint";
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

export const fetchGrammarPointsFromDb = async (
  ids: number[],
): Promise<GrammarPoint[]> => {
  const grammarDto = await db.query.grammarPoints.findMany({
    where: inArray(grammarPoints.id, ids),
    with: {
      exercises: true,
    },
  });

  return grammarDto.map(GrammarPointFromDB);
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
    shortTitle: g.shortTitle ?? "",
    detailedTitle: g.detailedTitle ?? "",
    englishTitle: g.englishTitle ?? "",
    structure: g.structure ?? "",
    order: g.order ?? undefined,
    examples: g.exercises.map((e, i) => ({
      ru: Example(e.ru),
      en: Example(e.en),
      order: i,
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
