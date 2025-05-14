import { eq, inArray } from "drizzle-orm";
import { db } from "../../../libs/db";
import { comingSoon, exercises, grammarPoints } from "../../../libs/db/schema";
import { Example } from "./example";
import type { ComingSoonDb } from "./types/ComingSoon";
import type { GrammarPointDb } from "./types/dto";
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
    ...g,
    id: `${g.id}`,
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
      order: e.order,
    })),
  };
};

export const fetchComingSoonFromDb = async (): Promise<GrammarPoint[]> => {
  const comingSoonDto = await db.query.comingSoon.findMany();
  const exs = await db.query.exercises.findMany({
    where: inArray(
      exercises.grammarPointId,
      comingSoonDto.map((c) => c.id),
    ),
  });

  const exercisesByGrammarPointId = Object.groupBy(
    exs,
    (e) => e.grammarPointId,
  );

  return comingSoonDto.map((c) => {
    return ComingSoonFromDB({
      ...c,
      exercises: exercisesByGrammarPointId[c.id] ?? [],
    });
  });
};

export const fetchComingSoonGrammarPointFromDb = async (
  id: number,
): Promise<GrammarPoint | undefined> => {
  const comingSoonDto = await db.query.comingSoon.findFirst({
    where: eq(comingSoon.id, id),
    with: {
      exercises: true,
    },
  });
  return comingSoonDto && ComingSoonFromDB(comingSoonDto);
};

const ComingSoonFromDB = (c: ComingSoonDb): GrammarPoint => {
  return {
    ...c,
    id: `${c.id}`,
    detailedTitle: c.detailedTitle ?? "",
    englishTitle: c.englishTitle ?? "",
    structure: c.structure ?? "",
    torfl: "Coming soon",
    examples: c.exercises.map((e, i) => ({
      ru: Example(e.ru),
      en: Example(e.en),
      order: i,
    })),
    exercises: c.exercises.map((e, i) => ({
      grammarPointId: `${c.id}`,
      ru: e.ru,
      en: e.en,
      ruGrammar: extractGrammar(e.ru) ?? "",
      enGrammar: extractGrammar(e.en) ?? "",
      draft: e.helper ?? "",
      order: e.order,
    })),
  };
};
