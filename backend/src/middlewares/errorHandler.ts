import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

interface ErrorResponse {
  error: string;
  details?: unknown;
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const body: ErrorResponse = {
      error: 'Dados inválidos',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof AppError) {
    const body: ErrorResponse = { error: err.message };
    if (err.details !== undefined) {
      body.details = err.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  console.error('Erro inesperado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' } satisfies ErrorResponse);
};
