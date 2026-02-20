import type { ReactNode } from 'react';

type DataTableProps = {
  children: ReactNode;
};

export function DataTable({ children }: DataTableProps) {
  return <table className="w-full text-sm text-left">{children}</table>;
}
