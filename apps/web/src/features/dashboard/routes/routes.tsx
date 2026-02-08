import { Skeleton } from "@/web/shared/ui/skeleton";
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

const DashboardPage = lazy(() =>
  import("@screens/dashboard/dashboard.page").then((module) => ({
    default: module.default,
  })),
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<Skeleton />}>
        <DashboardPage />
      </Suspense>
    ),
  },
];
