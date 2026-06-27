import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Valida partes da requisição com schemas Zod. Em caso de dados inválidos,
 * o ZodError lançado é capturado pelo errorHandler central e vira um 400.
 */
export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.query) {
      Object.assign(req.query, schemas.query.parse(req.query));
    }
    if (schemas.params) {
      Object.assign(req.params, schemas.params.parse(req.params));
    }
    next();
  };
