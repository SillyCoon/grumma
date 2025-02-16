import type { Example } from "../types/Example";

const replaceAnswer = ([a, answer, b]: Example, newAnswer: string): Example => {
  return [a, answer.replaceAll(/\p{L}+/gu, newAnswer), b];
};

export { replaceAnswer };
