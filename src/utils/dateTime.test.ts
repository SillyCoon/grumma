import { expect, test } from "vitest";
import { generate24HourInterval } from "./dateTime";

test("generate24HoursInterval", () => {
  const result = generate24HourInterval(new Date("2020-10-10:12:00:00"));
  expect(result).toEqual([
    new Date("2020-10-10T13:00:00"),
    new Date("2020-10-10T14:00:00"),
    new Date("2020-10-10T15:00:00"),
    new Date("2020-10-10T16:00:00"),
    new Date("2020-10-10T17:00:00"),
    new Date("2020-10-10T18:00:00"),
    new Date("2020-10-10T19:00:00"),
    new Date("2020-10-10T20:00:00"),
    new Date("2020-10-10T21:00:00"),
    new Date("2020-10-10T22:00:00"),
    new Date("2020-10-10T23:00:00"),
    new Date("2020-10-11T00:00:00"),
    new Date("2020-10-11T01:00:00"),
    new Date("2020-10-11T02:00:00"),
    new Date("2020-10-11T03:00:00"),
    new Date("2020-10-11T04:00:00"),
    new Date("2020-10-11T05:00:00"),
    new Date("2020-10-11T06:00:00"),
    new Date("2020-10-11T07:00:00"),
    new Date("2020-10-11T08:00:00"),
    new Date("2020-10-11T09:00:00"),
    new Date("2020-10-11T10:00:00"),
    new Date("2020-10-11T11:00:00"),
    new Date("2020-10-11T12:00:00"),
  ]);
});
