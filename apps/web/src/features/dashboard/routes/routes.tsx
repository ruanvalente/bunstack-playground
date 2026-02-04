import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const DashboardPage = lazy(() =>
  import("@screens/dashboard/dashboard.page").then((module) => ({
    default: module.DashboardPage,
  })),
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardPage />,
  },
];
