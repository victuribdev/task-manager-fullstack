import type { StatusFilter, Task, TaskStatus } from '../types/task';
import { apiRequest } from './client';

export interface CreateTaskPayload {
  title: string;
}

export interface UpdateTaskPayload {
  title?: string;
  status?: TaskStatus;
}

export const tasksApi = {
  list: (status: StatusFilter): Promise<Task[]> => {
    const query = status === 'all' ? '' : `?status=${status}`;
    return apiRequest<Task[]>(`/tasks${query}`);
  },

  create: (payload: CreateTaskPayload): Promise<Task> =>
    apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateTaskPayload): Promise<Task> =>
    apiRequest<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  remove: (id: string): Promise<Task> =>
    apiRequest<Task>(`/tasks/${id}`, { method: 'DELETE' }),
};
