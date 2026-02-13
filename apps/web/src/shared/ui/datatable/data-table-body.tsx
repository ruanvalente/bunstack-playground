import type { ReactNode } from "react";

export function DataTableBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  );
}
