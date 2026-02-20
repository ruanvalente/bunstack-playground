import type { ReactNode } from 'react';

type DataTableRootProps = {
  children: ReactNode;
};

export function DataTableRoot({ children }: DataTableRootProps) {
  return (
    <div className="relative overflow-x-auto bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  );
}
