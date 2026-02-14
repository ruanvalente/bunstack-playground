import type { ChartDataPointDTO } from "@bunstack-playground/shared/http";
import { ChartWidget } from "@/web/shared/widgets/chart/chart-widget.widget";

type LineChartWidgetProps = {
  data?: ChartDataPointDTO[];
};

export function LineChartWidget({ data }: LineChartWidgetProps) {
  const chartData = data && data.length > 0 ? data : [];

  const formattedData = {
    labels: chartData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Tasks Completed",
        data: chartData.map((item) => item.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return <ChartWidget type="line" data={formattedData} />;
}
