import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import { Header } from "@shared/ui/header/header";
import { SidebarComponent } from "@shared/ui/sidebar";
import { PageSkeleton } from "../ui/skeleton";

import { NAV_ITEMS } from "@/web/config/constants";
import "@/web/index.css";

export default function MainLayout() {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="flex min-h-screen bg-gray-50">
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
      </body>
    </html>
  );
}
