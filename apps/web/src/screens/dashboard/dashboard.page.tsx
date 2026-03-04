import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import type { DashboardResponseDTO } from '@bunstack-playground/shared/http';

import { useLanguage } from '@shared/hooks/use-language';
import { toast } from '@shared/ui/toaster';
import { getDashboardData } from '@/web/features/dashboard/queries/dashboard.querie';
import { ChartsWidget } from '@/web/features/dashboard/widgets/charts-widget';
import { KPIWidget } from '@/web/features/dashboard/widgets/kpi-widget';
import { SummaryWidget } from '@/web/features/dashboard/widgets/summary-widget';
import { ErrorBoundary } from '@/web/shared/ui/error-boundary';
import { DashboardSkeleton } from '@/web/shared/ui/skeleton';

export default function DashboardPage() {
  const { t } = useLanguage();
  const initialData = useLoaderData() as DashboardResponseDTO;

  const { data: dashboard, isError } = useQuery<DashboardResponseDTO>({
    queryKey: ['dashboard', 30],
    queryFn: () => getDashboardData(30),
    initialData,
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load dashboard data');
    }
  }, [isError]);

  if (!dashboard) {
    return <DashboardSkeleton />;
  }

  const { kpis, charts, totals } = dashboard;

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950 mb-2">
        {t.common.dashboard}
      </h1>

      <div className="mb-6">
        <ErrorBoundary>
          <KPIWidget kpis={kpis} />
        </ErrorBoundary>
      </div>
      <div>
        <ErrorBoundary>
          <ChartsWidget charts={charts} />
        </ErrorBoundary>
      </div>
      <div>
        <ErrorBoundary>
          <SummaryWidget totals={totals} />
        </ErrorBoundary>
      </div>
    </section>
  );
}
