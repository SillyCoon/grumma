import { BarList } from "ui/progress-bar-list";
import type { Schedule } from "space-repetition";
import { calculateWeekSchedule } from "./logic/schedule";

export const WeekSchedule = (props: { schedule: Schedule }) => {
  const weekSchedule = calculateWeekSchedule(props.schedule);
  const chart = weekSchedule
    .map(([v, i]) => ({
      value: i,
      name: v,
      id: v,
    }))
    .toArray();

  return (
    <BarList width="relative" sortOrder="none" data={chart} class="mt-2" />
  );
};
