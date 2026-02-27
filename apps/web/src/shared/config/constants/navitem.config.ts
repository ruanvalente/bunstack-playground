import { CheckSquare, LayoutDashboard, Settings, Users } from 'lucide-react';

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/dashboard',
  },
  {
    label: 'Tasks',
    icon: CheckSquare,
    route: '/dashboard/tasks',
  },
  {
    label: 'Configurations',
    icon: Settings,
    route: '/dashboard/settings',
  },
  {
    label: 'Users',
    icon: Users,
    route: '/dashboard/users',
  },
];
