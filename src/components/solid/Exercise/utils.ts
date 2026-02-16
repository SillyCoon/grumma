export const parseToExercise = (str: string) => {
  return str
    .replaceAll(/%([^%]+)%/g, (_, grammar) => `%#${grammar}%`)
    .split("%")
    .map((p) => p.trim())
    .map((part) => {
      if (part.includes("#"))
        return { type: "grammar", text: ` ${part.replace("#", "")} ` } as const;
      return { type: "text", text: part } as const;
    });
};

export const normalizeAnswer = (str: string) => str.trim();

export const compareAnswer = (correct: string, answer: string): boolean => {
  const normalizeForComparison = (str: string) =>
    str.trim().toLowerCase().replace(/ё/g, "е");

  return normalizeForComparison(correct) === normalizeForComparison(answer);
};

export const validAnswer = (answer: string) => {
  const reg = /[^а-яё\s]/i;
  return !reg.test(answer);
};
