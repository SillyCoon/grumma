import { describe, test, expect } from "vitest";
import type { Attempt } from "./types/Attempt";
import { faker } from "@faker-js/faker";
import type { Stage } from "./types/Stage";
import { addMinute } from "@formkit/tempo";
import { NaiveAlgorithm } from "./NaiveAlgorithm";
import { StageSettings } from "./StageSettings";

const nextMultiplier = 2;

const nextTime = (date: Date, attempt: number) =>
  addMinute(date, attempt * nextMultiplier);

const makeGpSession = (
  sessionId: string,
  stage: Stage,
  grammarPointId: string,
  date: Date,
  attempts: number,
): Attempt[] => {
  const firstNWrong = [...Array(attempts - 1).keys()].map((_, i) => ({
    grammarPointId,
    stage,
    answer: faker.string.sample(),
    isCorrect: false,
    answeredAt: nextTime(date, i + 1),
    reviewSessionId: sessionId,
  }));
  const lastCorrect = {
    grammarPointId,
    stage,
    answer: faker.string.sample(),
    isCorrect: true,
    answeredAt: nextTime(date, attempts + 1),
    reviewSessionId: sessionId,
  };

  return [...firstNWrong, lastCorrect];
};

describe("Naive", () => {
  test("Native algorithm works", () => {
    const firstSessionDate = new Date("2020-10-10T10:00");
    const secondSessionDate = new Date("2020-11-10T10:00");
    const thirdSessionDate = new Date("2020-11-19T10:00");

    const firstSession = [
      ...makeGpSession("1", 1, "1", firstSessionDate, 3),
      ...makeGpSession("1", 2, "2", firstSessionDate, 1),
      ...makeGpSession("1", 5, "3", firstSessionDate, 2),
    ];

    const secondSession = [...makeGpSession("2", 1, "1", secondSessionDate, 2)];

    const thirdSession = [
      ...makeGpSession("3", 5, "5", thirdSessionDate, 1),
      ...makeGpSession("4", 6, "6", thirdSessionDate, 1),
      ...makeGpSession("5", 2, "7", thirdSessionDate, 3),
    ];

    const schedule = NaiveAlgorithm.getSchedule(
      [...firstSession, ...secondSession, ...thirdSession],
      {
        stageDowngradeMultiplier: 2,
        stageMinutes: StageSettings,
      },
    );

    expect(schedule).toEqual([
      {
        grammarPointId: "1",
        stage: 1,
        availableAt: addMinute(
          nextTime(secondSessionDate, 1),
          StageSettings[1],
        ),
      },
      {
        grammarPointId: "2",
        stage: 3,
        availableAt: addMinute(nextTime(firstSessionDate, 2), StageSettings[3]),
      },
      {
        grammarPointId: "3",
        stage: 3,
        availableAt: addMinute(nextTime(firstSessionDate, 1), StageSettings[3]),
      },
      {
        grammarPointId: "5",
        stage: 6,
        availableAt: addMinute(nextTime(thirdSessionDate, 2), StageSettings[6]),
      },
      {
        grammarPointId: "6",
        stage: 7,
        availableAt: addMinute(nextTime(thirdSessionDate, 2), StageSettings[7]),
      },
      {
        grammarPointId: "7",
        stage: 1,
        availableAt: addMinute(nextTime(thirdSessionDate, 2), StageSettings[1]),
      },
    ]);
  });
});
