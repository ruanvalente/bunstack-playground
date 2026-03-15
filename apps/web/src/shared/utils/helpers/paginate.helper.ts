import type { PaginationInfo } from '@bunstack-playground/shared/http';

import type { PaginatedResult } from '../../types/ui/pagination.type';

export function paginateHelper<T>(
  items: T[],
  page: number,
  perPage: number
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * perPage;
  const end = start + perPage;

  const paginationInfo: PaginationInfo = {
    page: safePage,
    pageSize: perPage,
    total,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };

  return {
    data: items.slice(start, end),
    pagination: paginationInfo,
  };
}
