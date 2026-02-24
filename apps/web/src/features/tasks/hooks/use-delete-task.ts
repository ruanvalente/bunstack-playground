import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../queries/task.querie';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return mutation;
}
