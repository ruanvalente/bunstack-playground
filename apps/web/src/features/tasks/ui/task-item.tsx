type TaskItemProps = {
  id: string;
  title: string;
  completed: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskItem({
  title,
  completed,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <div
      className={`
        group flex items-center gap-4 px-4 py-4 my-4
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-xl
        transition-all duration-200
        hover:border-indigo-300 dark:hover:border-green-600/50
        hover:shadow-sm
        active:scale-[0.995]
        focus-within:ring-2 focus-within:ring-green-500/40 focus-within:ring-offset-2
        ${completed ? 'opacity-75' : ''}
      `}
    >
      <div className="relative flex items-center shrink-0 py-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="peer absolute inset-0 -left-3 -top-3 -bottom-3 w-11 h-auto
    opacity-0 cursor-pointer z-10"
        />
        <div
          className={`
            w-5 h-5 rounded-md border-2 flex items-center justify-center
            transition-all duration-200
            peer-focus:ring-2 peer-focus:ring-green-500/30 peer-focus:ring-offset-2
            ${
              completed
                ? 'bg-green-600 border-green-600'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-500'
            }
          `}
        >
          {completed && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      <span
        className={`
          flex-1 text-gray-800 dark:text-gray-200
          transition-all duration-200
          ${completed ? 'line-through text-gray-500 dark:text-gray-500' : ''}
        `}
      >
        {title}
      </span>

      {completed && (
        <span className="text-xs font-bold text-green-600 dark:text-green-400 opacity-70">
          concluído
        </span>
      )}

      {!completed && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
      )}
    </div>
  );
}
