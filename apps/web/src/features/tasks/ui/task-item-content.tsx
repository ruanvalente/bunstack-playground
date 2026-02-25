import { Chip } from '@shared/ui/chip/chip';

type TaskItemContentProps = {
  title: string;
  completed: boolean;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
};

export function TaskItemContent({
  title,
  completed,
  categoryId,
  categoryName,
  categoryColor,
}: TaskItemContentProps) {
  return (
    <span
      className={`
        flex-1 text-gray-800 dark:text-gray-200
        transition-all duration-200
        ${completed ? 'line-through text-gray-500 dark:text-gray-500' : ''}
      `}
    >
      {title}
      {categoryId && categoryName && categoryColor && (
        <Chip label={categoryName} color={categoryColor} />
      )}
    </span>
  );
}
