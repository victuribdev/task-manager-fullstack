import { NotFoundError } from '../errors/AppError';
import { TaskRepository, taskRepository } from '../repositories/task.repository';
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
} from '../schemas/task.schema';
import type { Task } from '../types/task';

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  list(query: ListTasksQuery): Task[] {
    return this.repository.findAll(query.status);
  }

  create(input: CreateTaskInput): Task {
    return this.repository.create(input.title);
  }

  update(id: string, input: UpdateTaskInput): Task {
    const updated = this.repository.update(id, input);
    if (!updated) {
      throw new NotFoundError(`Tarefa com id "${id}" não encontrada`);
    }
    return updated;
  }

  remove(id: string): Task {
    const removed = this.repository.remove(id);
    if (!removed) {
      throw new NotFoundError(`Tarefa com id "${id}" não encontrada`);
    }
    return removed;
  }
}

export const taskService = new TaskService(taskRepository);
