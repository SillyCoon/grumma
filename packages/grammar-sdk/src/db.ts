import { eq, inArray } from "drizzle-orm";
import { db } from "../../../libs/db";
import type { GrammarPoint } from "./types/GrammarPoint";
import { grammarPointsTmp } from "../../../libs/db/schema-tmp";
import type { GrammarPointDb } from "./types/dto";

export const fetchGrammarPointFromDb = async (
  id: number,
): Promise<GrammarPoint | undefined> => {
  const grammarDto = await db.query.grammarPointsTmp.findFirst({
    where: eq(grammarPointsTmp.id, +id),
    with: {
      exercises: {
        with: {
          parts: {
            with: {
              acceptableAnswers: true,
            },
          },
        },
      },
    },
  });

  return grammarDto && GrammarPointFromDB(grammarDto);
};

export const fetchGrammarPointsFromDb = async (
  ids: number[],
): Promise<GrammarPoint[]> => {
  const grammarDto = await db.query.grammarPointsTmp.findMany({
    where: inArray(grammarPointsTmp.id, ids),
    with: {
      exercises: {
        with: {
          parts: {
            with: {
              acceptableAnswers: true,
            },
          },
        },
      },
    },
  });

  return grammarDto.map(GrammarPointFromDB);
};
export const fetchGrammarFromDb = async (): Promise<GrammarPoint[]> => {
  const grammarDto = await db.query.grammarPointsTmp.findMany({
    with: {
      exercises: {
        with: {
          parts: {
            with: {
              acceptableAnswers: true,
            },
          },
        },
      },
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
  const exercises = g.exercises.map((e) => ({
    ru: e.parts
      .filter((p) => p.language === "ru")
      .toSorted((a, b) => a.order - b.order)
      .map((p) => p.text) as [string, string, string],
    en: e.parts
      .filter((p) => p.language === "en")
      .toSorted((a, b) => a.order - b.order)
      .map((p) => p.text) as [string, string, string],
    order: e.order,
  }));

  return {
    ...g,
    id: `${g.id}`,
    torfl: g.torfl ?? "Coming soon",
    detailedTitle: g.detailedTitle ?? undefined,
    englishTitle: g.englishTitle ?? undefined,
    structure: g.structure ?? undefined,
    examples: exercises,
    explanation: g.explanation ?? undefined,
    exercises: exercises.map((e) => ({
      grammarPointId: `${g.id}`,
      ru: e.ru.join(""),
      en: e.en.join(""),
      ruGrammar: e.ru[1],
      enGrammar: e.en[1],
      draft: "",
      order: e.order,
    })),
  };
};
