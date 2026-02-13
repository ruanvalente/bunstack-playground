import { ChartWidget } from "@/web/shared/widgets/chart/chart-widget.widget";

export function LineChartWidget() {
  const data = {
    labels: ["Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    datasets: [
      {
        label: "Revenue Monthly ($)",
        data: [32000, 38000, 42000, 41000, 45231, 48000, 55231],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
  return <ChartWidget type="line" data={data} />;
}
