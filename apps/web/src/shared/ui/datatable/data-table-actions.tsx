type DataTableActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export function DataTableActions({ onEdit, onDelete }: DataTableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="py-2 px-4 rounded border text-xs font-medium text-indigo-600 bg-transparent hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:cursor-pointer transition-all"
        >
          Editar
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="py-2 px-4 rounded border text-xs font-medium text-red-600 bg-transparent hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500  hover:cursor-pointer transition-all"
        >
          Excluir
        </button>
      )}
    </div>
  );
}
