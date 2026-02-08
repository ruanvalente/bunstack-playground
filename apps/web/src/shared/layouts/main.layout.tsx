import { Outlet } from "react-router-dom";
import { Suspense, useEffect } from "react";

import { Header } from "@shared/ui/header/header";
import { SidebarComponent } from "@shared/ui/sidebar";
import { PageSkeleton } from "../ui/skeleton";
import { useUserSettingsStore } from "@/web/features/settings/store/user-settings.store";

import { NAV_ITEMS } from "@/web/shared/config/constants";
import "@/web/index.css";

export default function MainLayout() {
  const theme = useUserSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <div className="antialiased flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarComponent.Root>
        <SidebarComponent.Sidebar>
          {NAV_ITEMS.map((item) => (
            <SidebarComponent.SidebarItem key={item.route} {...item} />
          ))}
        </SidebarComponent.Sidebar>
      </SidebarComponent.Root>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
