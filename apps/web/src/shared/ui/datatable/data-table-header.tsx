import type { ReactNode } from "react";

export function DataTableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>{children}</tr>
    </thead>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
      {children}
    </th>
  );
}
