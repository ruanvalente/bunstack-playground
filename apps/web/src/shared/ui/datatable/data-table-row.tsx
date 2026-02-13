import type { ReactNode } from "react";

type DataTableRowProps = {
  children: ReactNode;
};

export function DataTableRow({ children }: DataTableRowProps) {
  return (
    <tr
      className="
        transition-colors
        hover:bg-gray-50 dark:hover:bg-gray-800/60
      "
    >
      {children}
    </tr>
  );
}
