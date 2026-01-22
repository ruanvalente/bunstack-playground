import { lazy } from "react";
import type { RouteObject } from "react-router";

const SettingsPage = lazy(() =>
  import("../../../screens/settings/settings.page").then((module) => ({
    default: module.SettingsPage,
  })),
);

export const settingsRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: <SettingsPage />,
  },
];
