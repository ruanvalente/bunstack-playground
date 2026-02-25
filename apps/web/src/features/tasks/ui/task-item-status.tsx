type TaskItemStatusProps = {
  completed: boolean;
};

export function TaskItemStatus({ completed }: TaskItemStatusProps) {
  if (!completed) return null;

  return (
    <span className="text-xs font-bold text-green-600 dark:text-green-400 opacity-70">
      concluído
    </span>
  );
}
