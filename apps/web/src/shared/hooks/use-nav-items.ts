import { CheckSquare, LayoutDashboard, Settings, Users } from 'lucide-react';

import { useLanguage } from '@shared/hooks/use-language';

export function useNavItems() {
  const { t } = useLanguage();

  return [
    {
      label: t.common.dashboard,
      icon: LayoutDashboard,
      route: '/dashboard',
    },
    {
      label: t.common.tasks,
      icon: CheckSquare,
      route: '/dashboard/tasks',
    },
    {
      label: t.common.configurations,
      icon: Settings,
      route: '/dashboard/settings',
    },
    {
      label: t.common.users,
      icon: Users,
      route: '/dashboard/users',
    },
  ];
}
