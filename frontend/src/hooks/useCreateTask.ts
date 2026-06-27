import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, type CreateTaskPayload } from '../api/tasks';
import type { Task } from '../types/task';
import { tasksKeys } from './useTasks';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskPayload>({
    mutationFn: (payload) => tasksApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });
}
