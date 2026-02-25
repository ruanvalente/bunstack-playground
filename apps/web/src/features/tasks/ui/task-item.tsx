import { TaskItemCheckbox } from './task-item-checkbox';
import { TaskItemContent } from './task-item-content';
import { TaskItemStatus } from './task-item-status';
import { TaskItemActions } from './task-item-actions';

type TaskItemProps = {
  id: string;
  title: string;
  completed: boolean;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskItem({
  title,
  completed,
  categoryId,
  categoryName,
  categoryColor,
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
      <TaskItemCheckbox checked={completed} onChange={onToggle} />

      <TaskItemContent
        title={title}
        completed={completed}
        categoryId={categoryId}
        categoryName={categoryName}
        categoryColor={categoryColor}
      />

      <TaskItemStatus completed={completed} />

      <TaskItemActions
        completed={completed}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
