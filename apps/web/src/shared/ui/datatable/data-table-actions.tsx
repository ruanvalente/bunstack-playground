import { useLanguage } from '@shared/hooks/use-language';

type DataTableActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export function DataTableActions({ onEdit, onDelete }: DataTableActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="py-1.5 px-2 md:py-2 md:px-4 rounded border text-xs font-medium text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-transparent hover:bg-indigo-700 hover:text-white dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:cursor-pointer transition-all"
        >
          {t.common.edit}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="py-1.5 px-2 md:py-2 md:px-4 rounded border text-xs font-medium text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 bg-transparent hover:bg-red-700 hover:text-white dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500  hover:cursor-pointer transition-all"
        >
          {t.common.delete}
        </button>
      )}
    </div>
  );
}
