import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import type { Task } from '../types/task';
import { tasksKeys } from './useTasks';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, string>({
    mutationFn: (id) => tasksApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });
}
