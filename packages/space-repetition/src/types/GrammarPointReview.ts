import type { Exercise } from "grammar-sdk";
import type { Stage } from "./Stage";

/**
 * Grammar point with exercise and stage to use as a part of a review round in space repetition session
 */
export type GrammarPointReview = {
  exercise: Exercise;
  stage: Stage;
};
