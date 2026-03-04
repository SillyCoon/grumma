import { eq, inArray } from "drizzle-orm";
import { db } from "../../../libs/db";
import type { GrammarPoint } from "./types/GrammarPoint";
import { grammarPointsTmp } from "../../../libs/db/schema-tmp";
import type { GrammarPointDb } from "./types/dto";
import type { ExercisePart } from "./exercise";

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
    id: `${g.id}`,
    shortTitle: g.shortTitle,
    order: g.order,
    torfl: g.torfl ?? "Coming soon",
    detailedTitle: g.detailedTitle ?? undefined,
    englishTitle: g.englishTitle ?? undefined,
    structure: g.structure ?? undefined,
    examples: exercises,
    explanation: g.explanation ?? undefined,
    exercises: g.exercises.map((e) => ({
      id: e.id,
      grammarPointId: e.grammarPointId.toString(),
      order: e.order,
      hide: e.hide,
      parts: e.parts
        .filter((p) => p.language === "ru")
        .toSorted((a, b) => a.order - b.order)
        .map(partFromDB),
      translationParts: e.parts
        .filter((p) => p.language === "en")
        .toSorted((a, b) => a.order - b.order)
        .map(partFromDB),
    })),
  };
};

const partFromDB = (
  p: GrammarPointDb["exercises"][number]["parts"][number],
): ExercisePart => {
  if (p.type === "text") {
    return {
      id: p.id,
      index: p.order,
      type: p.type,
      text: p.text,
    };
  }
  return {
    id: p.id,
    index: p.order,
    type: p.type,
    text: p.text,
    description: p.description ?? undefined,
    acceptableAnswers:
      p.acceptableAnswers?.map((ans) => ({
        text: ans.text,
        description: ans.description ?? undefined,
        variant: ans.variant,
      })) ?? [],
  };
};
