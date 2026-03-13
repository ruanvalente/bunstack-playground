import { useEffect, useRef, useState } from 'react';

import { ChevronDown, Plus, X } from 'lucide-react';

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from '../hooks/use-categories';

type CategorySelectProps = {
  value?: string;
  onChange: (categoryId: string | undefined) => void;
};

const PRESET_COLORS = [
  '#3B82F6',
  '#10B981',
  '#8B5CF6',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
] as const;

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const selectedCategory = categories.find((c) => c.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const result = await createCategory.mutateAsync({
        name: newCategoryName.trim(),
        color: selectedColor,
      });
      onChange(result.id);
      setIsCreating(false);
      setNewCategoryName('');
      setSelectedColor(PRESET_COLORS[0]);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteCategory = async (
    e: React.MouseEvent,
    categoryId: string
  ) => {
    e.stopPropagation();
    try {
      await deleteCategory.mutateAsync(categoryId);
      if (value === categoryId) {
        onChange(undefined);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedCategory ? (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedCategory.color }}
            />
            <span className="text-sm truncate">{selectedCategory.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Select a category</span>
        )}
        <div className="flex items-center gap-1">
          {selectedCategory && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">Loading...</div>
          ) : (
            <>
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    value === category.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCategory(e, category.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {isCreating ? (
                <div className="p-3 border-t border-gray-200">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-1 mb-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-5 h-5 rounded-full ${
                          selectedColor === color
                            ? 'ring-2 ring-offset-1 ring-gray-400'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="flex-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={
                        !newCategoryName.trim() || createCategory.isPending
                      }
                      className="flex-1 px-2 py-1 text-xs text-white bg-primary rounded hover:bg-primary/90 disabled:opacity-50 dark:bg-primary-dark dark:hover:bg-primary-dark/80"
                    >
                      {createCategory.isPending ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200"
                >
                  <Plus className="w-4 h-4" />
                  Create new category
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
