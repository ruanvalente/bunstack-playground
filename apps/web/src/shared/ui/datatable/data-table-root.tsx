import type { ReactNode } from "react";

type DataTableRootProps = {
  children: ReactNode;
};

export function DataTableRoot({ children }: DataTableRootProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {children}
    </div>
  );
}
