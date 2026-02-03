export type Example = [string, string, string];

export namespace Example {
  export const replaceAnswer = (
    [a, answer, b]: Example,
    newAnswer: string,
  ): Example => {
    return [a, answer.replaceAll(/\p{L}+/gu, newAnswer), b];
  };
}
