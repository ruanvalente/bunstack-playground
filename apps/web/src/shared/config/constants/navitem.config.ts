import { CheckSquare, LayoutDashboard, Settings, Users } from 'lucide-react';

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/app/dashboard',
  },
  {
    label: 'Tasks',
    icon: CheckSquare,
    route: '/app/dashboard/tasks',
  },
  {
    label: 'Configurations',
    icon: Settings,
    route: '/app/dashboard/settings',
  },
  {
    label: 'Users',
    icon: Users,
    route: '/app/dashboard/users',
  },
];
