import { eq, inArray } from "drizzle-orm";
import { db } from "../../../libs/db";
import type { GrammarPoint } from "./grammar-point";
import { grammarPointsTmp } from "../../../libs/db/schema-tmp";
import { GrammarPointDb, GrammarPointsDb } from "./grammar-point/dto";

export const getGrammarPoint = async (
  id: number,
): Promise<GrammarPoint | undefined> => {
  const grammarDto = await db.query.grammarPointsTmp.findFirst({
    where: eq(grammarPointsTmp.id, id),
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

  return grammarDto && GrammarPointDb.toGrammarPoint(grammarDto);
};

export const getGrammarPoints = async (
  ids?: number[],
): Promise<GrammarPoint[]> => {
  const grammarDto = await db.query.grammarPointsTmp.findMany({
    where: ids ? inArray(grammarPointsTmp.id, ids) : undefined,
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

  return GrammarPointsDb.toGrammarPoints(grammarDto);
};
