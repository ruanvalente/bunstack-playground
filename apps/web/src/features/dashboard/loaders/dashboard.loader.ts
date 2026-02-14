import type { LoaderFunctionArgs } from "react-router-dom";
import { getDashboardData } from "../queries/dashboard.querie";
import type { QueryClient } from "@tanstack/react-query";

export const dashboardLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days") ?? "30");

    return queryClient.ensureQueryData({
      queryKey: ["dashboard", days],
      queryFn: () => getDashboardData(days),
    });
  };
