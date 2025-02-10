import { transliterate as transliterateLib } from "@digitallinguistics/transliterate";

export const transliterate = (input: string) => {
  return transliterateLib(input, substitutions);
};

const substitutions = {
  a: "а",
  b: "б",
  v: "в",
  g: "г",
  d: "д",
  e: "е",
  yo: "ё",
  zh: "ж",
  z: "з",
  i: "и",
  j: "й",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  f: "ф",
  h: "х",
  c: "ц",
  ch: "ч",
  shh: "ш",
  sch: "щ",
  '"': "ъ",
  y: "ы",
  "'": "ь",
  "e'": "э",
  yu: "ю",
  ya: "я",
};
