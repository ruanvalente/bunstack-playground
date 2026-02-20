import type { ChartDataPointDTO } from '@bunstack-playground/shared/http';
import { ChartWidget } from '@/web/shared/widgets/chart/chart-widget.widget';

type BarChartWidgetProps = {
  data?: ChartDataPointDTO[];
};

export function BarChartWidget({ data }: BarChartWidgetProps) {
  const chartData = data && data.length > 0 ? data : [];

  const formattedData = {
    labels: chartData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('pt-BR', {
        month: 'short',
        day: 'numeric',
      });
    }),
    datasets: [
      {
        label: 'Tasks Created',
        data: chartData.map((item) => item.count),
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
      },
    ],
  };

  return <ChartWidget type="bar" data={formattedData} />;
}
