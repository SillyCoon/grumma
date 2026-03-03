import type { GrammarPoint } from "grammar-sdk";
import type { Stage } from "./Stage";

/**
 * Grammar point with exercise and stage to use as a part of a review round in space repetition session
 */
export type GrammarPointReview = Omit<GrammarPoint, "exercises"> & {
  exercise: GrammarPoint["exercises"][number];
  stage: Stage;
};
