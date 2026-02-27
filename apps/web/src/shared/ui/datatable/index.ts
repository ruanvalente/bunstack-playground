import { DataTable } from './data-table';
import { DataTableActions } from './data-table-actions';
import { DataTableBody } from './data-table-body';
import { DataTableCell } from './data-table-cell';
import { DataTableHead, DataTableHeader } from './data-table-header';
import { DataTableRoot } from './data-table-root';
import { DataTableRow } from './data-table-row';

export const DataTableComponent = {
  Root: DataTableRoot,
  Table: DataTable,
  Header: DataTableHeader,
  Head: DataTableHead,
  Body: DataTableBody,
  Row: DataTableRow,
  Cell: DataTableCell,
  Actions: DataTableActions,
};
