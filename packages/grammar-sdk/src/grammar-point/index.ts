import { err, ok, type Result } from "neverthrow";
import { Context } from "../context";
import { FullExamples, type FullExample } from "../example";
import { Exercises, type Exercise } from "../exercise";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <expected>
import { Set } from "immutable";

export interface GrammarPoint {
  id: string;
  shortTitle: string;
  order: number;
  hide: boolean;

  examples: FullExample[];
  exercises: Exercise[];

  torfl?: string;
  detailedTitle?: string;
  englishTitle?: string;
  structure?: string;
  explanation?: string;
}

export type CreateGrammarPoint = Omit<
  GrammarPoint,
  "id" | "order" | "examples" | "exercises" | "hide"
>;

export type UpdateGrammarPoint = Partial<
  Omit<GrammarPoint, "examples" | "exercises">
> &
  Pick<GrammarPoint, "id">;

export const GrammarPoint = {
  isVisible(gp: GrammarPoint, context: Context) {
    return !gp.hide || Context.isAdmin(context);
  },
};

export const GrammarPoints = {
  filterVisible(grammarPoints: GrammarPoint[], context: Context) {
    const filteredGrammar = grammarPoints.filter((gp) =>
      GrammarPoint.isVisible(gp, context),
    );
    return filteredGrammar.map((gp) => ({
      ...gp,
      exercises: Exercises.filterVisible(gp.exercises, context),
      examples: FullExamples.filterVisible(gp.examples, context),
    }));
  },
  maxOrder(grammarPoints: GrammarPoint[]) {
    return grammarPoints.reduce((max, gp) => Math.max(max, gp.order), 0);
  },
  validateNewOrder(
    grammarPoints: GrammarPoint[],
    newOrder: { id: string; order: number }[],
  ): Result<true, string> {
    if (
      !Set(grammarPoints.map((gp) => gp.id)).equals(
        Set(newOrder.map((o) => o.id)),
      )
    ) {
      return err(
        "Can't update order partially. All grammar points must be included.",
      );
    }

    const newOrderSet = Set(newOrder.map((o) => o.order));

    if (newOrderSet.size !== newOrder.length) {
      return err("Duplicate orders are not allowed.");
    }

    return ok(true);
  },
  checkViolation(
    grammarPoints: GrammarPoint[],
    uoc: UpdateGrammarPoint | CreateGrammarPoint,
  ): Result<true, string> {
    const grammarToCheck =
      "id" in uoc
        ? grammarPoints.filter((gp) => gp.id !== uoc.id)
        : grammarPoints;

    if (grammarToCheck.some((gp) => "order" in uoc && gp.order === uoc.order)) {
      return err(
        `Another grammar point already has the order ${"order" in uoc ? uoc.order : ""}.`,
      );
    }
    if (grammarToCheck.some((gp) => gp.shortTitle === uoc.shortTitle)) {
      return err(
        `Another grammar point already has the short title "${uoc.shortTitle}".`,
      );
    }
    return ok(true);
  },
};
