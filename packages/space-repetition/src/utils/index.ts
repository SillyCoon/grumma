import type Immutable from "immutable";
import { Seq } from "immutable";
import { dayStart, diffDays, format } from "@formkit/tempo";

export const countStreak = (
  today: Date,
  timezone: string,
  interval: Date[],
) => {
  const todayFormatted = dayStart(
    format({ date: today, format: "YYYY-MM-DD", tz: timezone }),
  );

  const formattedInterval = Seq(interval)
    .map((v) => format({ date: v, format: "YYYY-MM-DD", tz: timezone }))
    .toSet()
    .map(dayStart);

  const count = countWhileDiffIsDay(
    formattedInterval.add(todayFormatted).sort((a, b) => +b - +a),
  );

  const hasToday = formattedInterval.has(todayFormatted);
  const modifier = hasToday ? 1 : 0;

  return count + modifier;
};

const countWhileDiffIsDay = (dates: Immutable.OrderedSet<Date>) => {
  return dates
    .zipWith((a, b) => [a, b] as [Date, Date], dates.skip(1))
    .takeWhile(([a, b]) => Math.abs(diffDays(a, b)) <= 1).size;
};
