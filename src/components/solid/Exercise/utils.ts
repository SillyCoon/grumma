export const normalizeAnswer = (str: string) => str.trim();

export const compareAnswer = (correct: string, answer: string): boolean => {
  const normalizeForComparison = (str: string) =>
    str.trim().toLowerCase().replace(/ё/g, "е");

  return normalizeForComparison(correct) === normalizeForComparison(answer);
};

export const validAnswer = (answer: string) => {
  const reg = /[^а-яё\s-]/i;
  return !reg.test(answer);
};
