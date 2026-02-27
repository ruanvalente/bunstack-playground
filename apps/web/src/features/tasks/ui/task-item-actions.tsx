type TaskItemActionsProps = {
  completed: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskItemActions({
  completed,
  onEdit,
  onDelete,
}: TaskItemActionsProps) {
  if (completed) return null;

  return (
    <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
      <button
        type="button"
        onClick={onEdit}
        className="p-2 text-gray-500 hover:cursor-pointer hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        title="Edit task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="p-2 text-gray-500 hover:cursor-pointer hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
        title="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
