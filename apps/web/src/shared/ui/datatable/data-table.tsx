import type { ReactNode } from "react";

type DataTableProps = {
  children: ReactNode;
};

export function DataTable({ children }: DataTableProps) {
  return <table className="w-full border-collapse min-w-160">{children}</table>;
}
