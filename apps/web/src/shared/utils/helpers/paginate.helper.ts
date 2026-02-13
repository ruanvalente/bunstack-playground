import type { PaginatedResult } from "../../types/ui/pagination.type";

export function paginateHelper<T>(
  items: T[],
  page: number,
  perPage: number,
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * perPage;
  const end = start + perPage;

  return {
    data: items.slice(start, end),
    pagination: {
      page: safePage,
      perPage,
      total,
      totalPages,
    },
  };
}
