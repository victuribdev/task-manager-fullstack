import { randomUUID } from 'node:crypto';
import type { Task, TaskStatus } from '../types/task';

type TaskChanges = Partial<Pick<Task, 'title' | 'status'>>;

export class TaskRepository {
  private readonly tasks = new Map<string, Task>();

  findAll(status?: TaskStatus): Task[] {
    const all = Array.from(this.tasks.values());
    const filtered = status ? all.filter((task) => task.status === status) : all;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(title: string): Task {
    const task: Task = {
      id: randomUUID(),
      title,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  update(id: string, changes: TaskChanges): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Task = { ...existing, ...changes };
    this.tasks.set(id, updated);
    return updated;
  }

  remove(id: string): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) {
      return undefined;
    }
    this.tasks.delete(id);
    return existing;
  }

  clear(): void {
    this.tasks.clear();
  }
}

export const taskRepository = new TaskRepository();
