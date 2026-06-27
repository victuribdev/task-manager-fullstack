import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, type UpdateTaskPayload } from '../api/tasks';
import type { Task } from '../types/task';
import { tasksKeys } from './useTasks';

interface UpdateTaskVariables {
  id: string;
  payload: UpdateTaskPayload;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskVariables>({
    mutationFn: ({ id, payload }) => tasksApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });
}
