import type { Schedule } from "~/server/feature/space-repetition/types/Schedule";
import { Range, Map as IMap, Seq, List } from "immutable";
import { diffDays } from "@formkit/tempo";

function getNextWeekAbbreviations(): string[] {
  // Create an array of the full names of the days of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const todayIndex = new Date().getDay();

  return [
    "Today",
    ...Range(1, 7)
      .map((v) => {
        const currentDayIndex = (todayIndex + v) % 7; // Loop around the week
        return daysOfWeek[currentDayIndex].substring(0, 3);
      })
      .toArray(),
  ];
}

export const calculateWeekSchedule = (schedule: Schedule) => {
  const countByDaysOfTheWeek: number[] = [];

  const today = new Date();

  Seq(schedule)
    .sortBy((v) => v.availableAt)
    .forEach((v) => {
      const diffWithToday = diffDays(v.availableAt, today);
      const adjustedDiff = diffWithToday > 0 ? diffWithToday : 0;
      if (diffWithToday > 6) return;
      for (let i = adjustedDiff; i <= 6; i++) {
        countByDaysOfTheWeek[i] = (countByDaysOfTheWeek[i] ?? 0) + 1;
      }
    });

  return Seq(getNextWeekAbbreviations()).zip(List(countByDaysOfTheWeek));
};
