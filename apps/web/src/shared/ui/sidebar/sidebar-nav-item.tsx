import { Link, useLocation } from 'react-router-dom';

import type { ComponentType, SVGProps } from 'react';

import { useSidebarStore } from '@shared/store/sidebar.store';

type SidebarItemProps = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  route: string;
};

export function SidebarItem({ label, icon: Icon, route }: SidebarItemProps) {
  const location = useLocation();
  const isOpen = useSidebarStore((s) => s.isOpen);

  const isActive = location.pathname === route;

  if (!isOpen) {
    return (
      <Link
        to={route}
        title={label}
        className={`flex items-center justify-center p-3 rounded-lg transition
          ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }
        `}
      >
        <span className="text-xl">{<Icon fontSize={18} />}</span>
      </Link>
    );
  }

  return (
    <Link
      to={route}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-700'
        }
      `}
    >
      <span className="text-xl">{<Icon fontSize={18} />}</span>
      <span className="font-medium text-white">{label}</span>
    </Link>
  );
}
