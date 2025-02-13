import type Immutable from "immutable";
import { Seq } from "immutable";
import { dayStart, diffDays } from "@formkit/tempo";

export const countConsecutiveDaysBefore = (
  beforeIncluding: Date,
  interval: Date[],
) => {
  const before = Seq(interval)
    .map(dayStart)
    .toSet()
    .sort((a, b) => +b - +a)
    .skipWhile((date) => date > dayStart(beforeIncluding));

  return countWhileDiffIsDay(before, dayStart(beforeIncluding));
};

const countWhileDiffIsDay = (
  dates: Immutable.OrderedSet<Date>,
  including: Date,
) => {
  const first = dates.first();
  if (!first || Math.abs(diffDays(first, including)) > 1) return 0;
  const sum =
    dates
      .zipWith((a, b) => [a, b] as [Date, Date], dates.skip(1))
      .takeWhile(([a, b]) => Math.abs(diffDays(a, b)) <= 1).size ?? 0;

  return sum + (+first === +including ? 1 : 0);
};
