import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, toggleTask } from "@features/tasks/queries/task.querie";
import { TaskItem } from "@features/tasks/ui/task-item";
import type { Task } from "@bunstack-playground/shared/domain";

export function TaskListWidget() {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery<Array<Task>>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const toggleMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const currentTasks = queryClient.getQueryData<Array<Task>>(["tasks"]);
      const task = currentTasks?.find((t) => t.id === taskId);
      return toggleTask(taskId, task?.completed ?? false);
    },

    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Array<Task>>(["tasks"]);

      queryClient.setQueryData<Array<Task>>(["tasks"], (old) =>
        old?.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      );

      return { previousTasks };
    },

    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        Carregando tarefas...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8 text-red-500">
        Erro ao carregar as tarefas.
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        Nenhuma tarefa encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          title={task.title}
          completed={task.completed}
          onToggle={() => toggleMutation.mutate(task.id)}
        />
      ))}
    </div>
  );
}
