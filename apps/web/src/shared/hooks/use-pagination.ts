type UsePaginationParams = {
  currentPage: number;
  totalPages: number;
};

export function usePagination({
  currentPage,
  totalPages,
}: UsePaginationParams) {
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  function getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  }

  return {
    pages: getPageNumbers(),
    isPrevDisabled,
    isNextDisabled,
  };
}
