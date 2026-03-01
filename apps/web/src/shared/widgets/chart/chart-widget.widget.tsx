import { lazy, Suspense, useMemo } from 'react';

import type { ChartData, ChartOptions, ChartType } from 'chart.js';

import { Skeleton } from '@/web/shared/ui/skeleton';

const ChartLazy = lazy(() =>
  import('react-chartjs-2').then((module) => ({
    default: module.Chart,
  }))
);

const ChartComponents = lazy(() =>
  import('./chart-registration').then((module) => ({
    default: module.ChartComponents,
  }))
);

type ChartWidgetProps = {
  type?: ChartType;
  data: ChartData;
  options?: ChartOptions;
  height?: string;
};

export function ChartWidget({
  type = 'line',
  data,
  options = {},
  height = '100%',
}: ChartWidgetProps) {
  const chartOptions = useMemo<ChartOptions>(() => {
    const defaultOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      scales:
        type === 'bar' || type === 'line'
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
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <ChartComponents>
          <ChartLazy
            type={type}
            data={data}
            options={chartOptions}
            className="block max-w-full"
          />
        </ChartComponents>
      </Suspense>
    </div>
  );
}
