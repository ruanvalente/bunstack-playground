import type { ReactNode } from "react";

type DataTableCellProps = {
  children: ReactNode;
};

export function DataTableCell({ children }: DataTableCellProps) {
  return (
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-100/40 dark:bg-gray-800/40">
      {children}
    </td>
  );
}
