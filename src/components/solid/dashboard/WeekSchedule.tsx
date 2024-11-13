import type { Schedule } from "~/server/feature/space-repetition/types/Schedule";
import { calculateWeekSchedule } from "./logic/schedule";
import { BarList } from "@components/ui/progress-bar-list";

export const WeekSchedule = (props: { schedule: Schedule }) => {
  const weekSchedule = calculateWeekSchedule(props.schedule);
  const chart = weekSchedule
    .map(([v, i]) => ({
      value: i,
      name: v,
      id: v,
      total: 10,
    }))
    .toArray();

  return <BarList data={chart} class="mt-2" />;
};
