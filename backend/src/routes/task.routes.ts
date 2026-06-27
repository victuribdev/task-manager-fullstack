import { Router } from 'express';
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from '../controllers/task.controller';
import { validate } from '../middlewares/validate';
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from '../schemas/task.schema';

export const taskRouter = Router();

taskRouter.get('/', validate({ query: listTasksQuerySchema }), listTasks);

taskRouter.post('/', validate({ body: createTaskSchema }), createTask);

taskRouter.patch(
  '/:id',
  validate({ params: taskIdParamSchema, body: updateTaskSchema }),
  updateTask,
);

taskRouter.delete('/:id', validate({ params: taskIdParamSchema }), deleteTask);
