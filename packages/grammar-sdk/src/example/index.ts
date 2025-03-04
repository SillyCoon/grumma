export type Example = [string, string, string];
export function Example(str: string): Example {
  const regex = /(.*)%(.*?)%(.*)/;
  const matches = str.match(regex);

  if (matches) {
    return [matches[1] ?? "", matches[2] ?? "", matches[3] ?? ""];
  }
  return ["", "", ""];
}

export namespace Example {
  export const replaceAnswer = (
    [a, answer, b]: Example,
    newAnswer: string,
  ): Example => {
    return [a, answer.replaceAll(/\p{L}+/gu, newAnswer), b];
  };
}
