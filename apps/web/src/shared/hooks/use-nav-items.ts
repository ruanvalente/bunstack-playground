import { useAuthStore } from '@features/auth/store/auth.store';
import { CheckSquare, LayoutDashboard, Settings, Users } from 'lucide-react';

import { useLanguage } from '@shared/hooks/use-language';

export function useNavItems() {
  const { t } = useLanguage();
  const userRole = useAuthStore((state) => state.userRole);

  const navItems = [
    {
      label: t.common.dashboard,
      icon: LayoutDashboard,
      route: '/app/dashboard',
    },
    {
      label: t.common.tasks,
      icon: CheckSquare,
      route: '/app/dashboard/tasks',
    },
    {
      label: t.common.configurations,
      icon: Settings,
      route: '/app/dashboard/settings',
    },
  ];

  if (userRole === 'ADMIN') {
    navItems.push({
      label: t.users.title,
      icon: Users,
      route: '/app/dashboard/users',
    });
  }

  return navItems;
}
