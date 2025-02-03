export type Example = [string, string, string];
export const Example = (str: string): Example => {
  const regex = /(.*)%(.*?)%(.*)/;
  const matches = str.match(regex);

  if (matches) {
    return [matches[1] ?? "", matches[2] ?? "", matches[3] ?? ""];
  }
  return ["", "", ""];
};
