import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';

const app = createApp();

describe('App (health e rotas desconhecidas)', () => {
  it('GET /health retorna 200', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('rota inexistente retorna 404 (2.5)', async () => {
    const res = await request(app).get('/qualquer-coisa');

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Rota não encontrada');
  });
});
