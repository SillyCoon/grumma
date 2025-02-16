import { faker } from "@faker-js/faker";
import type { Attempt, Stage } from "..";
import type { Session } from "../src/types/Session";

export const mockAttempt = (gp?: Partial<Attempt>): Attempt => ({
  grammarPointId: faker.string.alphanumeric(),
  stage: faker.number.int({ min: 1, max: 12 }) as Stage,
  answer: faker.string.alpha(),
  isCorrect: faker.datatype.boolean(),
  answeredAt: faker.date.recent(),
  reviewSessionId: faker.string.uuid(),
  ...gp,
});

export const mockSession = (attempts: Attempt[]): Session => ({
  sessionId: faker.string.uuid(),
  attempts,
});
