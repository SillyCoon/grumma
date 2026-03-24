import { eq, inArray } from "drizzle-orm";
import { db } from "../../../libs/db";
import { type exercises, grammarPoints } from "../../../libs/db/schema";
import { Example } from "./example";
import type { GrammarPoint } from "./grammar-point";
import type { InferSelectModel } from "drizzle-orm";

export const getGrammarPoint = async (
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

export const getGrammarPoints = async (
  ids?: number[],
): Promise<GrammarPoint[]> => {
  const grammarDto = await db.query.grammarPoints.findMany({
    ...(ids ? { where: inArray(grammarPoints.id, ids) } : {}),
    with: {
      exercises: true,
    },
  });

  return grammarDto.map(GrammarPointFromDB);
};
const GrammarPointFromDB = (g: GrammarPointDb): GrammarPoint => {
  return {
    id: `${g.id}`,
    hide: false,
    shortTitle: g.shortTitle ?? undefined,
    order: g.order ?? undefined,
    torfl: g.torfl ?? undefined,
    detailedTitle: g.detailedTitle ?? undefined,
    englishTitle: g.englishTitle ?? undefined,
    structure: g.structure ?? undefined,
    examples: g.exercises.map((e) => ({
      hide: false,
      ru: Example.fromLegacy(e.ru),
      en: Example.fromLegacy(e.en),
      order: e.order,
    })),
    exercises: g.exercises.map((e) => {
      const ru = Example.fromLegacy(e.ru);
      const en = Example.fromLegacy(e.en);
      return {
        grammarPointId: `${g.id}`,
        hide: false,
        order: e.order,
        parts: [
          {
            index: 0,
            text: ru[0] ?? "",
            type: "text",
          },
          {
            index: 1,
            text: ru[1] ?? "",
            type: "answer",
          },
          {
            index: 2,
            text: ru[2] ?? "",
            type: "text",
          },
        ],
        translationParts: [
          {
            index: 0,
            text: en[0] ?? "",
            type: "text",
          },
          {
            index: 1,
            text: en[1] ?? "",
            type: "answer",
          },
          {
            index: 2,
            text: en[2] ?? "",
            type: "text",
          },
        ],
      };
    }),
  };
};

type GrammarPointDb = InferSelectModel<typeof grammarPoints> & {
  exercises: InferSelectModel<typeof exercises>[];
};
