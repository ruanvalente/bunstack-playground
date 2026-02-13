import { useMemo } from "react";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
  type ChartData,
  type ChartOptions,
  type ChartType,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

type ChartWidgetProps = {
  type?: ChartType;
  data: ChartData;
  options?: ChartOptions;
  height?: string;
};

export function ChartWidget({
  type = "line",
  data,
  options = {},
  height = "100%",
}: ChartWidgetProps) {
  const chartOptions = useMemo<ChartOptions>(() => {
    const defaultOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales:
        type === "bar" || type === "line"
          ? {
              y: {
                beginAtZero: true,
              },
            }
          : {},
    };

    return {
      ...defaultOptions,
      ...options,
    };
  }, [type, options]);

  return (
    <div className="w-full h-60 flex flex-col" style={{ height }}>
      <Chart
        type={type}
        data={data}
        options={chartOptions}
        className="block max-w-full"
      />
    </div>
  );
}
