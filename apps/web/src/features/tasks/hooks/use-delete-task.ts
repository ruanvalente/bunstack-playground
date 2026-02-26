import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../queries/task.querie';
import { toast } from '@shared/ui/toaster';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  return mutation;
}
