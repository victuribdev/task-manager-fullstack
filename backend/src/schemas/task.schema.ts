import { z } from 'zod';

export const taskStatusSchema = z.enum(['pending', 'done']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'O título é obrigatório e não pode ser vazio'),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'O título não pode ser vazio').optional(),
    status: taskStatusSchema.optional(),
  })
  .refine((data) => data.title !== undefined || data.status !== undefined, {
    message: 'Informe ao menos um campo para atualizar (title ou status)',
  });

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
});

export const taskIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
