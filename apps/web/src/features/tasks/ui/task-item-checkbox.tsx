type TaskItemCheckboxProps = {
  checked: boolean;
  onChange: () => void;
};

export function TaskItemCheckbox({ checked, onChange }: TaskItemCheckboxProps) {
  return (
    <div className="relative flex items-center shrink-0 py-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer absolute inset-0 -left-3 -top-3 -bottom-3 w-11 h-auto opacity-0 cursor-pointer z-10"
      />
      <div
        className={`
          w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-all duration-200
          peer-focus:ring-2 peer-focus:ring-green-500/30 peer-focus:ring-offset-2
          ${
            checked
              ? 'bg-green-600 border-green-600'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-500'
          }
        `}
      >
        {checked && (
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
  );
}
