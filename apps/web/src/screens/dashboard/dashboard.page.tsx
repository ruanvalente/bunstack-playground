import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { DashboardResponseDTO } from "@bunstack-playground/shared/http";
import { getDashboardData } from "@/web/features/dashboard/queries/dashboard.querie";
import { KPIWidget } from "@/web/features/dashboard/widgets/kpi-widget";
import { ChartsWidget } from "@/web/features/dashboard/widgets/charts-widget";
import { SummaryWidget } from "@/web/features/dashboard/widgets/summary-widget";
import { DashboardSkeleton } from "@/web/shared/ui/skeleton";

export default function DashboardPage() {
  const initialData = useLoaderData() as DashboardResponseDTO;

  const { data: dashboard } = useQuery<DashboardResponseDTO>({
    queryKey: ["dashboard", 30],
    queryFn: () => getDashboardData(30),
    initialData,
    staleTime: 0,
    refetchOnMount: true,
  });

  if (!dashboard) {
    return <DashboardSkeleton />;
  }

  const { kpis, charts, totals } = dashboard;

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950 mb-2">
        Dashboard
      </h1>

      <div className="mb-6">
        <KPIWidget kpis={kpis} />
      </div>
      <div>
        <ChartsWidget charts={charts} />
      </div>
      <div>
        <SummaryWidget totals={totals} />
      </div>
    </section>
  );
}
