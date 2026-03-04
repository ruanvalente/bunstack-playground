import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Task } from '@bunstack-playground/shared/domain';
import type { PaginatedTasksResponseDTO } from '@bunstack-playground/shared/http';

import { useLanguage } from '@shared/hooks/use-language';
import type { TaskFilterState } from '@shared/ui/filter/filter';
import { Pagination } from '@shared/ui/pagination/pagination';
import { TaskListSkeleton } from '@shared/ui/skeleton/task-list-skeleton';
import { toast } from '@shared/ui/toaster';
import { ErrorBoundary } from '@/web/shared/ui/error-boundary';

import { getCategories } from '../../categories/queries/category.querie';
import { useDeleteTask } from '../hooks/use-delete-task';
import { getTasks, toggleTask } from '../queries/task.querie';
import { EditTaskModal } from '../ui/edit-task-modal';
import { TaskItem } from '../ui/task-item';

type CategoryInfo = {
  name: string;
  color: string;
};

function getCategoryInfo(
  categoryId: string | undefined,
  categories: { id: string; name: string; color: string }[]
): CategoryInfo | undefined {
  if (!categoryId) return undefined;
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return undefined;
  return {
    name: category.name,
    color: category.color,
  };
}

type TaskListWidgetProps = {
  filters: TaskFilterState;
};

export function TaskListWidget({ filters }: TaskListWidgetProps) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

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

  const isLoading = !tasks;

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!tasks || newPage < 1 || newPage > tasks.pagination.totalPages)
        return;

      const params = new URLSearchParams(location.search);
      params.set('page', String(newPage));
      params.set('perPage', String(perPage));

      const newUrl = `${location.pathname}?${params.toString()}`;
      if (location.search !== `?${params.toString()}`) {
        navigate(newUrl);
      }
    },
    [location, navigate, perPage, tasks]
  );

  const handleEdit = useCallback((task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (taskId: string) => {
      toast.warning(t.tasks.deleteConfirm, {
        action: {
          label: t.tasks.delete,
          onClick: () => deleteMutation.mutate(taskId),
        },
        cancel: {
          label: t.common.cancel,
          onClick: () => {},
        },
      });
    },
    [deleteMutation, t]
  );

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
      toast.error(t.tasks.failedToUpdateTask);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 30] });
      toast.success(t.tasks.taskStatusUpdated);
    },
  });

  const handleToggle = useCallback(
    (id: string, completed: boolean) => {
      toggleMutation.mutate({ id, completed });
    },
    [toggleMutation]
  );

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  }, []);

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (!tasks || tasks.data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        {t.tasks.noTasksFound}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-2">
          {tasks.data.map((task) => {
            const categoryInfo = getCategoryInfo(task.categoryId, categories);
            return (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
                categoryId={task.categoryId}
                categoryName={categoryInfo?.name}
                categoryColor={categoryInfo?.color}
                onToggle={() => handleToggle(task.id, task.completed)}
                onEdit={() => handleEdit(task)}
                onDelete={() => handleDelete(task.id)}
              />
            );
          })}
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
          onClose={handleCloseModal}
        />
      </div>
    </ErrorBoundary>
  );
}
