import type { PaginationInfo } from '@bunstack-playground/shared/http';

export type PaginationPosition = 'left' | 'center' | 'right';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  position?: PaginationPosition;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationInfo;
};
