import type { ReactNode } from "react";

export function DataTableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="text-sm bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
      <tr>{children}</tr>
    </thead>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <th scope="col" className="px-6 py-3 font-medium text-gray-700 dark:text-gray-200">
      {children}
    </th>
  );
}
