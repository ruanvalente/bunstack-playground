import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskTitle } from '../queries/task.querie';

export function useUpdateTaskTitle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateTaskTitle(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return mutation;
}
