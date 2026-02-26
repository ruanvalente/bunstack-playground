import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../queries/task.querie';
import { toast } from '@shared/ui/toaster';

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
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });

  return mutation;
}
