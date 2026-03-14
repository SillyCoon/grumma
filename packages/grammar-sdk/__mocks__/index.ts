import { faker } from "@faker-js/faker";
import type { GrammarPoint } from "grammar-sdk";
import type { Exercise } from "grammar-sdk/exercise";
import { Range } from "immutable";
import type { Example } from "../src/example";

export const mockGrammarPoint = (gp?: Partial<GrammarPoint>): GrammarPoint => ({
  id: faker.string.uuid(),
  shortTitle: `${faker.lorem.sentence()}`,
  detailedTitle: `${faker.lorem.sentence()}`,
  englishTitle: `${faker.lorem.sentence()}`,
  order: faker.number.int({ min: 1, max: 100 }),
  structure: faker.string.sample(),
  examples: [{ ru: mockExample(), en: mockExample(), order: 0 }],
  exercises: Range(0, 12)
    .map((i) => mockExercise({ grammarPointId: gp?.id, order: i }))
    .toArray()
    .toSorted((a, b) => a.order - b.order),
  torfl: "A1",
  hidden: faker.datatype.boolean(),
  ...gp,
});

export const mockExample = (): Example => [
  `${faker.company.buzzNoun()} `,
  faker.food.adjective(),
  ` ${faker.commerce.productMaterial()}`,
];

export const mockExercise = (e?: Partial<Exercise>): Exercise => ({
  grammarPointId: faker.string.uuid(),
  order: faker.number.int({ min: 1, max: 12 }),
  hide: false,
  parts: [],
  translationParts: [],
  ...e,
});
