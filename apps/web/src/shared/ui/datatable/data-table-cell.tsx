import type { ReactNode } from "react";

type DataTableCellProps = {
  children: ReactNode;
};

export function DataTableCell({ children }: DataTableCellProps) {
  return (
    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
      {children}
    </td>
  );
}
