import { describe, test, expect } from "vitest";
import { countConsecutiveDaysBefore } from ".";
import { addDay, addMinute } from "@formkit/tempo";
import { Range } from "immutable";

const generatePeriodDays = (start: Date, days: number) => {
  const range = Range(1, days + 1).map((d) => addDay(start, d));
  return range.sortBy(Math.random).toArray();
};

describe("utils", () => {
  describe("consecutiveDaysPeriod", () => {
    test("should return the length of the period of consecutive days", () => {
      const including = new Date("2021-10-10");
      const intervalAfter = generatePeriodDays(including, 10);
      const intervalBefore = generatePeriodDays(addDay(including, -10), 10);

      const result = countConsecutiveDaysBefore(including, [
        ...intervalBefore,
        ...intervalAfter,
      ]);
      expect(result).toEqual(10);
    });

    test("should return the length of the period of consecutive days with repeating days", () => {
      const including = new Date("2021-10-10");
      const intervalAfter = generatePeriodDays(including, 10);
      const intervalBefore = generatePeriodDays(addDay(including, -10), 10);

      const result = countConsecutiveDaysBefore(including, [
        ...intervalBefore,
        ...intervalBefore.map((d) => addMinute(d, 10)),
        ...intervalAfter,
        ...intervalAfter.map((d) => addMinute(d, 10)),
      ]);
      expect(result).toEqual(10);
    });

    test("if only after days are provided", () => {
      const including = new Date("2021-10-10");
      const intervalAfter = generatePeriodDays(including, 10);

      const result = countConsecutiveDaysBefore(including, [...intervalAfter]);
      expect(result).toEqual(0);
    });

    test("if only before days are provided", () => {
      const including = new Date("2021-10-10");
      const intervalBefore = generatePeriodDays(addDay(including, -10), 10);

      const result = countConsecutiveDaysBefore(including, [...intervalBefore]);
      expect(result).toEqual(10);
    });

    test("all dates in the past more than 1 day apart", () => {
      const dates = [
        new Date("2024-11-10T11:10:55.031Z"),
        new Date("2024-11-11T08:57:48.433Z"),
        new Date("2024-11-13T23:26:13.931Z"),
        new Date("2025-02-09T03:55:42.604Z"),
        new Date("2025-02-09T03:55:44.121Z"),
        new Date("2025-02-09T03:55:46.854Z"),
        new Date("2025-02-09T03:57:12.223Z"),
        new Date("2025-02-09T03:57:15.356Z"),
        new Date("2025-02-10T05:00:14.043Z"),
      ];
      const today = new Date("2025-02-13T05:00:14.043Z");
      const result = countConsecutiveDaysBefore(today, dates);
      expect(result).toEqual(0);
    });

    test("one dates in the past one is same day", () => {
      const dates = [
        new Date("2024-11-10T11:10:55.031Z"),
        new Date("2024-11-11T08:57:48.433Z"),
        new Date("2024-11-13T23:26:13.931Z"),
        new Date("2025-02-09T03:55:42.604Z"),
        new Date("2025-02-09T03:55:44.121Z"),
        new Date("2025-02-09T03:55:46.854Z"),
        new Date("2025-02-09T03:57:12.223Z"),
        new Date("2025-02-09T03:57:15.356Z"),
        new Date("2025-02-10T05:00:14.043Z"),
        new Date("2025-02-13T04:00:14.043Z"),
      ];
      const today = new Date("2025-02-13T05:00:14.043Z");
      const result = countConsecutiveDaysBefore(today, dates);
      expect(result).toEqual(1);
    });
  });
});
