import { useState } from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Task } from '@bunstack-playground/shared/domain';
import type { PaginatedTasksResponseDTO } from '@bunstack-playground/shared/http';

import { Pagination } from '@shared/ui/pagination/pagination';
import { TaskListSkeleton } from '@shared/ui/skeleton/task-list-skeleton';
import { getTasks, toggleTask } from '../queries/task.querie';
import { TaskItem } from '../ui/task-item';
import { EditTaskModal } from '../ui/edit-task-modal';
import type { TaskFilterState } from '@shared/ui/filter/filter';
import { useDeleteTask } from '../hooks/use-delete-task';
import { getCategories } from '../../categories/queries/category.querie';
import { toast } from '@shared/ui/toaster';

interface TaskListWidgetProps {
  filters: TaskFilterState;
}

export function TaskListWidget({ filters }: TaskListWidgetProps) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const deleteMutation = useDeleteTask();

  const page = Number(new URLSearchParams(location.search).get('page') ?? 1);
  const perPage = Number(
    new URLSearchParams(location.search).get('perPage') ?? 10
  );

  const apiFilters = {
    statusFilter:
      filters.statusFilter === 'all' ? undefined : filters.statusFilter,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    categoryFilter: filters.categoryFilter,
  };

  const queryKey = [
    'tasks',
    page,
    perPage,
    filters.statusFilter,
    filters.sortBy,
    filters.sortOrder,
    filters.categoryFilter,
  ];

  const { data: tasks } = useQuery<PaginatedTasksResponseDTO>({
    queryKey,
    queryFn: () => getTasks(page, perPage, apiFilters),
    staleTime: 5 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const isLoading = navigation.state === 'loading';

  function handlePageChange(newPage: number) {
    if (!tasks || newPage < 1 || newPage > tasks.pagination.totalPages) return;

    const params = new URLSearchParams(location.search);
    params.set('page', String(newPage));
    params.set('perPage', String(perPage));

    const newUrl = `${location.pathname}?${params.toString()}`;
    if (location.search !== `?${params.toString()}`) {
      navigate(newUrl);
    }
  }

  function handleEdit(task: Task) {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  }

  function handleDelete(taskId: string) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(taskId);
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
              : task
          ),
        };
      });

      return { previousTasks };
    },

    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
      toast.error('Failed to update task status');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 30] });
      toast.success('Task status updated');
    },
  });

  function getCategoryInfo(categoryId?: string) {
    if (!categoryId) return undefined;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return undefined;
    return {
      name: category.name,
      color: category.color,
    };
  }

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (!tasks || tasks.data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
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
            id={task.id}
            title={task.title}
            completed={task.completed}
            categoryId={task.categoryId}
            categoryName={getCategoryInfo(task.categoryId)?.name}
            categoryColor={getCategoryInfo(task.categoryId)?.color}
            onToggle={() =>
              toggleMutation.mutate({
                id: task.id,
                completed: task.completed,
              })
            }
            onEdit={() => handleEdit(task)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>

      <Pagination
        currentPage={tasks.pagination.page}
        totalPages={tasks.pagination.totalPages}
        onPageChange={handlePageChange}
        position="center"
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        task={taskToEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }}
      />
    </div>
  );
}
