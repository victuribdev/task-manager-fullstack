import request from 'supertest';
import type { Express } from 'express';

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isIso8601 = (value: string): boolean =>
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;

/** Cria uma tarefa via API e devolve o corpo da resposta. */
export const createTask = async (app: Express, title: string) => {
  const res = await request(app).post('/tasks').send({ title });
  return res.body;
};
