import type { InferSelectModel } from "drizzle-orm";
import type { comingSoon, exercises } from "../../../../libs/db/schema";

export type ComingSoonDb = InferSelectModel<typeof comingSoon> & {
  exercises: InferSelectModel<typeof exercises>[];
};

export const ComingSoonTorfl = "Coming soon" as const;
export type ComingSoonTorfl = typeof ComingSoonTorfl;

export const isComingSoon = <T extends { torfl: string }>(
  grammarPoint: T,
): grammarPoint is T & { torfl: ComingSoonTorfl } => {
  return grammarPoint.torfl === ComingSoonTorfl;
};
