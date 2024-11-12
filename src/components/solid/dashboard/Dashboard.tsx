import { DefaultChart } from "solid-chartjs";
import type { Schedule } from "src/server/feature/space-repetition/types/Schedule";
import { format, isBefore } from "@formkit/tempo";
import { generate24HourInterval } from "src/utils/dateTime";
import { onMount } from "solid-js";
import { Chart, registerables } from "chart.js";

export const Dashboard = (props: {
  schedule: Schedule;
  date: Date;
}) => {
  const interval = generate24HourInterval(props.date);
  const chart = new Map(
    interval.map((i) => [
      i,
      props.schedule.filter((s) => isBefore(s.availableAt, i)).length,
    ]),
  );

  onMount(() => {
    Chart.register(...registerables);
  });

  const data = {
    labels: Array.from(chart.keys()).map((k) => `${format(k, "MM/DD HH")}h`),
    datasets: [
      {
        label: "Reviews by hour",
        data: Array.from(chart.values()),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <DefaultChart
        type={"bar"}
        data={data}
        options={options}
        width={400}
        height={400}
      />
    </div>
  );
};
