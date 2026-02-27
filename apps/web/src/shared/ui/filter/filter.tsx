import { useEffect, useRef, useState } from 'react';

import { getCategories } from '@features/categories/queries/category.querie';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Filter,
  Tag,
} from 'lucide-react';

export type TaskFilterState = {
  statusFilter: 'all' | 'completed' | 'pending';
  sortBy: 'created_at' | 'updated_at';
  sortOrder: 'ASC' | 'DESC';
  categoryFilter?: string;
};

const DEFAULT_FILTERS: TaskFilterState = {
  statusFilter: 'all',
  sortBy: 'created_at',
  sortOrder: 'DESC',
  categoryFilter: undefined,
};

type FilterWidgetProps = {
  filters: TaskFilterState;
  onFilterChange: (filters: TaskFilterState) => void;
};

export function FilterWidget({ filters, onFilterChange }: FilterWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (
    statusFilter: TaskFilterState['statusFilter']
  ) => {
    onFilterChange({ ...filters, statusFilter });
  };

  const handleSortChange = (
    sortBy: TaskFilterState['sortBy'],
    sortOrder: TaskFilterState['sortOrder']
  ) => {
    onFilterChange({ ...filters, sortBy, sortOrder });
  };

  const handleReset = () => {
    onFilterChange(DEFAULT_FILTERS);
  };

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const handleCategoryChange = (categoryId: string | undefined) => {
    onFilterChange({ ...filters, categoryFilter: categoryId });
  };

  const statusOptions = [
    { value: 'all' as const, label: 'All', icon: ArrowUpDown },
    { value: 'completed' as const, label: 'Completed', icon: CheckCircle },
    { value: 'pending' as const, label: 'Pending', icon: Circle },
  ];

  const sortOptions = [
    {
      value: { sortBy: 'created_at', sortOrder: 'DESC' as const },
      label: 'Newest',
      icon: Calendar,
    },
    {
      value: { sortBy: 'created_at', sortOrder: 'ASC' as const },
      label: 'Oldest',
      icon: Calendar,
    },
    {
      value: { sortBy: 'updated_at', sortOrder: 'DESC' as const },
      label: 'Recently Updated',
      icon: Clock,
    },
    {
      value: { sortBy: 'updated_at', sortOrder: 'ASC' as const },
      label: 'Least Recently Updated',
      icon: Clock,
    },
  ];

  const statusLabels: Record<TaskFilterState['statusFilter'], string> = {
    all: '',
    completed: 'Completed',
    pending: 'Pending',
  };

  const activeStatusLabel = statusLabels[filters.statusFilter];
  const hasActiveFilter =
    filters.statusFilter !== 'all' || filters.categoryFilter !== undefined;
  const activeCategoryLabel = filters.categoryFilter
    ? categories.find((c) => c.id === filters.categoryFilter)?.name
    : undefined;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md hover:cursor-pointer transition-colors ${
          hasActiveFilter
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Filter className="w-5 h-5" />
        <span>
          Filter{activeStatusLabel ? `: ${activeStatusLabel}` : ''}
          {activeCategoryLabel ? `: ${activeCategoryLabel}` : ''}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Filter Tasks
            </h3>
          </div>

          <div className="p-2">
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                Status
              </label>
              <div className="space-y-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      filters.statusFilter === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mb-3">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                Category
              </label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                <button
                  onClick={() => handleCategoryChange(undefined)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                    !filters.categoryFilter
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      filters.categoryFilter === category.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                Order By
              </label>
              <div className="space-y-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() =>
                      handleSortChange(
                        option.value.sortBy as 'created_at' | 'updated_at',
                        option.value.sortOrder as 'ASC' | 'DESC'
                      )
                    }
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      filters.sortBy === option.value.sortBy &&
                      filters.sortOrder === option.value.sortOrder
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleReset}
              className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-1"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DEFAULT_FILTERS };
