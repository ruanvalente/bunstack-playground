import type { ReactNode } from 'react';

type DataTableRowProps = {
  children: ReactNode;
};

export function DataTableRow({ children }: DataTableRowProps) {
  return (
    <tr className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      {children}
    </tr>
  );
}
