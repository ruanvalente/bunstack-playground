import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskTitle } from '../queries/task.querie';
import { toast } from '@shared/ui/toaster';

export function useUpdateTaskTitle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      title,
      categoryId,
    }: {
      id: string;
      title: string;
      categoryId?: string;
    }) => updateTaskTitle(id, title, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  return mutation;
}
