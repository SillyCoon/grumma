import type { labels } from "../../../../libs/db/schema-tmp";
import type { Label } from "./type";

export type LabelDb = typeof labels.$inferSelect;

export const LabelDb = {
  toLabel: (l: LabelDb): Label => ({
    id: l.id,
    name: l.name,
    color: l.color,
  }),
};

export const LabelsDb = {
  toLabels: (ls: LabelDb[]): Label[] => ls.map(LabelDb.toLabel),
};
