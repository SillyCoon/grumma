import { faker } from "@faker-js/faker";
import type { Example, Exercise, GrammarPoint } from "grammar-sdk";
import { Range } from "immutable";

export const mockGrammarPoint = (gp?: Partial<GrammarPoint>): GrammarPoint => ({
  id: faker.string.uuid(),
  shortTitle: `${faker.lorem.sentence()}`,
  detailedTitle: `${faker.lorem.sentence()}`,
  englishTitle: `${faker.lorem.sentence()}`,
  order: faker.number.int({ min: 1, max: 100 }),
  structure: faker.string.sample(),
  examples: [{ ru: mockExample(), en: mockExample() }],
  exercises: Range(0, 12)
    .map((i) => mockExercise({ grammarPointId: gp?.id, order: i }))
    .toArray()
    .toSorted((a, b) => a.order - b.order),
  ...gp,
  torfl: "A1",
});

export const mockExample = (): Example => [
  faker.string.alpha(),
  faker.string.alpha(),
  faker.string.alpha(),
];

export const mockExercise = (e?: Partial<Exercise>): Exercise => ({
  grammarPointId: faker.string.uuid(),
  en: faker.string.alpha(),
  ru: faker.string.alpha(),
  ruGrammar: faker.string.alpha(),
  enGrammar: faker.string.alpha(),
  draft: faker.string.alpha(),
  order: faker.number.int({ min: 1, max: 12 }),
  ...e,
});
