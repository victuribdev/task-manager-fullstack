import type { Request, Response } from 'express';
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
} from '../schemas/task.schema';
import { taskService } from '../services/task.service';

interface IdParams {
  id: string;
  [key: string]: string;
}

export const listTasks = (
  req: Request<unknown, unknown, unknown, ListTasksQuery>,
  res: Response,
): void => {
  const tasks = taskService.list(req.query);
  res.status(200).json(tasks);
};

export const createTask = (
  req: Request<unknown, unknown, CreateTaskInput>,
  res: Response,
): void => {
  const task = taskService.create(req.body);
  res.status(201).json(task);
};

export const updateTask = (
  req: Request<IdParams, unknown, UpdateTaskInput>,
  res: Response,
): void => {
  const task = taskService.update(req.params.id, req.body);
  res.status(200).json(task);
};

export const deleteTask = (req: Request<IdParams>, res: Response): void => {
  const task = taskService.remove(req.params.id);
  res.status(200).json(task);
};
