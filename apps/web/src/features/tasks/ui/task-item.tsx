type TaskItemProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export function TaskItem({ title, completed, onToggle }: TaskItemProps) {
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
        ${completed ? "opacity-75" : ""}
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
                ? "bg-green-600 border-green-600"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-500"
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
          ${completed ? "line-through text-gray-500 dark:text-gray-500" : ""}
        `}
      >
        {title}
      </span>

      {completed && (
        <span className="text-xs font-bold text-green-600 dark:text-green-400 opacity-70">
          concluído
        </span>
      )}
    </div>
  );
}
