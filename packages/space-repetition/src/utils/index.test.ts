import { describe, test, expect } from "vitest";
import { countStreak } from ".";
import { addDay } from "@formkit/tempo";
import { Range } from "immutable";

const generatePeriodDays = (start: Date, days: number) => {
  const range = Range(1, days + 1).map((d) => addDay(start, d));
  return range.sortBy(Math.random).toArray();
};

describe("utils", () => {
  describe("countStreak", () => {
    test("returns 0 if there are no dates", () => {
      const today = new Date("2025-02-13T12:00:00+09:00");
      const result = countStreak(today, "Asia/Tokyo", []);
      expect(result).toEqual(0);
    });

    test("1 if the only date is today", () => {
      const today = new Date("2025-02-13T12:00:00+09:00");
      const anotherToday = new Date("2025-02-13T13:00:00+09:00");

      const result = countStreak(today, "Asia/Tokyo", [anotherToday]);
      expect(result).toEqual(1);
    });

    test("1 if the only date is yesterday 00:00:00 local time. Today is 23:59:59 local time", () => {
      const almostTomorrow = new Date("2025-02-13T23:59:59+09:00");
      const almostDayBeforeYesterday = new Date("2025-02-12T00:00:00+09:00");
      const result = countStreak(almostTomorrow, "Asia/Tokyo", [
        almostDayBeforeYesterday,
      ]);
      expect(result).toEqual(1);
    });

    test("deduplicates attempts on the same day", () => {
      const today = new Date("2025-02-13T12:00:00+09:00");
      const anotherToday = new Date("2025-02-13T13:00:00+09:00");
      const yesterday = new Date("2025-02-12T12:00:00+09:00");
      const anotherYesterday = new Date("2025-02-12T13:00:00+09:00");

      const result = countStreak(today, "Asia/Tokyo", [
        today,
        yesterday,
        anotherYesterday,
        anotherToday,
      ]);
      expect(result).toEqual(2);
    });

    test("should return the length of the streak including today", () => {
      const today = new Date("2021-10-10T12:00:00+09:00");
      const intervalBefore = generatePeriodDays(addDay(today, -10), 10);

      const result = countStreak(today, "Asia/Tokyo", intervalBefore);
      expect(result).toEqual(10);
    });

    test("should return the length of the streak without today", () => {
      const today = new Date("2021-10-10T12:00:00+09:00");
      const yesterday = addDay(today, -1);

      const intervalBefore = generatePeriodDays(addDay(yesterday, -10), 10);

      const result = countStreak(today, "Asia/Tokyo", intervalBefore);
      expect(result).toEqual(10);
    });

    test("should break the streak if the date is more than 1 day apart", () => {
      const today = new Date("2021-10-10T12:00:00+09:00");
      const intervalBefore = [
        today,
        addDay(today, -1),
        addDay(today, -2),
        addDay(today, -3),
      ];

      const afterBreak = [
        addDay(today, -5),
        addDay(today, -6),
        addDay(today, -7),
      ];

      const result = countStreak(today, "Asia/Tokyo", [
        ...intervalBefore,
        ...afterBreak,
      ]);
      expect(result).toEqual(4);
    });
  });
});
