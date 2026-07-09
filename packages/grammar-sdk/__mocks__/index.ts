import { faker } from "@faker-js/faker";
import type { GrammarPoint } from "../src/grammar-point";
import type { Exercise } from "../src/exercise";
import { Range } from "immutable";
import type { Example, FullExample } from "../src/example";

export const mockGrammarPoint = (gp?: Partial<GrammarPoint>): GrammarPoint => ({
  id: faker.string.uuid(),
  shortTitle: `${faker.lorem.sentence()}`,
  detailedTitle: `${faker.lorem.sentence()}`,
  englishTitle: `${faker.lorem.sentence()}`,
  order: faker.number.int({ min: 1, max: 100 }),
  structure: faker.string.sample(),
  torfl: "A1",
  hide: faker.datatype.boolean(),
  labels: faker.helpers.arrayElements(
    [1, 2, 3, 4, 5],
    faker.number.int({ min: 0, max: 5 }),
  ),
  ...gp,
});

export const mockExample = (): Example => [
  `${faker.company.buzzNoun()} `,
  faker.food.adjective(),
  ` ${faker.commerce.productMaterial()}`,
];

export const mockFullExample = (e?: Partial<FullExample>): FullExample => ({
  ru: mockExample(),
  en: mockExample(),
  order: faker.number.int({ min: 1, max: 100 }),
  hide: faker.datatype.boolean(),
  ...e,
});

export const mockExercise = (e?: Partial<Exercise>): Exercise => ({
  grammarPointId: faker.string.uuid(),
  order: faker.number.int({ min: 1, max: 12 }),
  hide: false,
  parts: [],
  translationParts: [],
  ...e,
});

export const mockExercises = (
  count: number,
  grammarPointId?: string,
): Exercise[] => {
  return Range(0, count)
    .map((i) => mockExercise({ grammarPointId, order: i }))
    .toArray();
};
