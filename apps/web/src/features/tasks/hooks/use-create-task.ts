import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../queries/task.querie';

export function useCreateTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      title,
      categoryId,
    }: {
      title: string;
      categoryId?: string;
    }) => createTask(title, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return mutation;
}
