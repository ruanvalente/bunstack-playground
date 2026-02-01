import { usePagination } from "../../hooks/use-pagination";
import type {
  PaginationPosition,
  PaginationProps,
} from "../../types/ui/pagination.type";

const positionClasses: Record<PaginationPosition, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const navButtonBase = "px-3 py-2 border rounded-lg transition-all duration-200";

const navButtonEnabled =
  "hover:bg-gray-100 hover:cursor-pointer active:scale-95";

const navButtonDisabled =
  "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400";

export function Pagination({
  currentPage,
  totalPages,
  position = "left",
  onPageChange,
}: PaginationProps) {
  const { pages, isPrevDisabled, isNextDisabled } = usePagination({
    currentPage,
    totalPages,
  });

  return (
    <div className={`flex items-center gap-2 ${positionClasses[position]}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPrevDisabled}
        className={`${navButtonBase} ${
          isPrevDisabled ? navButtonDisabled : navButtonEnabled
        }`}
        title={
          isPrevDisabled ? "You are already on the first page" : "Previous page"
        }
      >
        Prev
      </button>

      <div className="flex gap-1">
        {pages.map((page, index) =>
          page === -1 ? (
            <span key={index} className="px-3 py-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg border transition-all ${
                page === currentPage
                  ? "bg-blue-500 text-white cursor-default"
                  : "hover:bg-gray-100 active:scale-95"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        className={`${navButtonBase} ${
          isNextDisabled ? navButtonDisabled : navButtonEnabled
        }`}
        title={
          isNextDisabled ? "You are already on the last page" : "Next page"
        }
      >
        Next
      </button>
    </div>
  );
}
