import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PaginatedTasksResponseDTO } from "@bunstack-playground/shared/http";

import { Pagination } from "@shared/ui/pagination/pagination";
import { getTasks, toggleTask } from "../queries/task.querie";
import { TaskItem } from "../ui/task-item";

export function TaskListWidget() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = useLoaderData() as PaginatedTasksResponseDTO;
  const navigation = useNavigation();

  const page = Number(new URLSearchParams(location.search).get("page") ?? 1);
  const perPage = Number(
    new URLSearchParams(location.search).get("perPage") ?? 10,
  );
  const queryKey = ["tasks", page, perPage];

  const { data: tasks } = useQuery<PaginatedTasksResponseDTO>({
    queryKey,
    queryFn: () => getTasks(page, perPage),
    initialData: initialData || undefined,
  });

  const isLoading = navigation.state === "loading";

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > tasks.pagination.totalPages) return;

    const params = new URLSearchParams(location.search);
    params.set("page", String(newPage));
    params.set("perPage", String(perPage));

    const newUrl = `${location.pathname}?${params.toString()}`;
    if (location.search !== `?${params.toString()}`) {
      navigate(newUrl);
    }
  }

  const toggleMutation = useMutation({
    mutationFn: (task: { id: string; completed: boolean }) =>
      toggleTask(task.id, !task.completed),

    onMutate: async (updatedTask: { id: string; completed: boolean }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTasks =
        queryClient.getQueryData<PaginatedTasksResponseDTO>(queryKey);

      queryClient.setQueryData<PaginatedTasksResponseDTO>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((task) =>
            task.id === updatedTask.id
              ? { ...task, completed: !task.completed }
              : task,
          ),
        };
      });

      return { previousTasks };
    },

    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", 30] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        Carregando tarefas...
      </div>
    );
  }

  if (!tasks || tasks.data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        Nenhuma tarefa encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {tasks.data.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            completed={task.completed}
            onToggle={() =>
              toggleMutation.mutate({
                id: task.id,
                completed: task.completed,
              })
            }
          />
        ))}
      </div>

      <Pagination
        currentPage={tasks.pagination.page}
        totalPages={tasks.pagination.totalPages}
        onPageChange={handlePageChange}
        position="center"
      />
    </div>
  );
}
