export type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const minStage: Stage = 1;
export const maxStage: Stage = 11;

const isStage = (value: number): value is Stage =>
  value >= minStage && value <= maxStage;

const nextStage = (stage: Stage): Stage => {
  const maybeNext = stage + 1;
  return isStage(maybeNext) ? maybeNext : maxStage;
};

const previousStage = (stage: Stage, multiplier: number): Stage => {
  const maybePrevStage = stage - multiplier;
  return isStage(maybePrevStage) ? maybePrevStage : minStage;
};

export const calculateNextStage = (
  stage: Stage,
  multiplier: number,
  isCorrect: boolean,
): Stage => (isCorrect ? nextStage(stage) : previousStage(stage, multiplier));
