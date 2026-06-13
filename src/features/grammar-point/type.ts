import type { GrammarPoint, Label } from "packages/grammar-sdk";

export type GrammarPointWithLabels = Omit<GrammarPoint, "labels"> & {
  labels: Label[];
};
export const GrammarPointWithLabels = (
  grammarPoints: GrammarPoint[],
  labels: Label[],
) => {
  const labelsMap = new Map(labels.map((v) => [v.id, v]));
  return grammarPoints.map((gp) => ({
    ...gp,
    labels: gp.labels
      .map((labelId) => labelsMap.get(labelId))
      .filter((label): label is Label => !!label),
  }));
};
