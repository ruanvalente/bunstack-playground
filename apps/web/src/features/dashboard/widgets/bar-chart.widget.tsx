import { ChartWidget } from "@/web/shared/widgets/chart/chart-widget.widget";

export function BarChartWidget() {
  const data = {
    labels: ["Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    datasets: [
      {
        label: "Active Users",
        data: [1800, 2100, 2350, 2200, 2500, 2800, 3200],
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1,
      },
    ],
  };
  return <ChartWidget type="bar" data={data} />;
}
