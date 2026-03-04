import { Suspense } from 'react';

import { Header } from '@shared/ui/header/header';
import { SidebarComponent } from '@shared/ui/sidebar';
import { useTheme } from '@/web/features/settings/hooks/use-theme';
import { useNavItems } from '@/web/shared/hooks/use-nav-items';

import { AnimatedOutlet } from '../ui/animation/animated-outlet';
import { PageSkeleton } from '../ui/skeleton';

import '@/web/index.css';

export default function MainLayout() {
  useTheme();
  const navItems = useNavItems();

  return (
    <div className="antialiased flex min-h-screen bg-gray-50 dark:bg-gray-100">
      <SidebarComponent.Root>
        <SidebarComponent.Sidebar>
          {navItems.map((item) => (
            <SidebarComponent.SidebarItem key={item.route} {...item} />
          ))}
        </SidebarComponent.Sidebar>
      </SidebarComponent.Root>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<PageSkeleton />}>
              <AnimatedOutlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
