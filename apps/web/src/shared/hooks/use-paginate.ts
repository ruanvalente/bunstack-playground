import { useMemo, useState } from "react";
import type { PaginatedResult } from "../types/ui/pagination.type";
import { paginateHelper } from "../utils/helpers/paginate.helper";

type UsePaginateOptions<T> = {
  items: T[];
  perPage?: number;
  initialPage?: number;
};

export function usePaginate<T>({
  items,
  perPage = 10,
  initialPage = 1,
}: UsePaginateOptions<T>): {
  result: PaginatedResult<T>;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  resetPage: () => void;
} {
  const [page, setPage] = useState(initialPage);

  const result = useMemo(() => {
    return paginateHelper(items, page, perPage);
  }, [items, page, perPage]);

  function onPageChange(newPage: number) {
    setPage(newPage);
  }

  function resetPage() {
    setPage(1);
  }

  return {
    result,
    page,
    perPage,
    onPageChange,
    resetPage,
  };
}
