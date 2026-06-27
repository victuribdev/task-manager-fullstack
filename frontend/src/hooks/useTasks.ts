import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import type { StatusFilter, Task } from '../types/task';

export const tasksKeys = {
  all: ['tasks'] as const,
  list: (status: StatusFilter) => [...tasksKeys.all, status] as const,
};

export function useTasks(status: StatusFilter) {
  return useQuery<Task[]>({
    queryKey: tasksKeys.list(status),
    queryFn: () => tasksApi.list(status),
  });
}
