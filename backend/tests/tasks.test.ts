import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { taskRepository } from '../src/repositories/task.repository';
import { UUID_REGEX, createTask, isIso8601 } from './helpers';

const app = createApp();

beforeEach(() => {
  taskRepository.clear();
});

describe('POST /tasks (2.1 - criar)', () => {
  it('cria uma tarefa e retorna 201 com o modelo completo', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Estudar TypeScript' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Estudar TypeScript', status: 'pending' });
    expect(res.body.id).toMatch(UUID_REGEX);
    expect(isIso8601(res.body.createdAt)).toBe(true);
  });

  it('faz trim do título antes de salvar', async () => {
    const res = await request(app).post('/tasks').send({ title: '   Comprar pão   ' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Comprar pão');
  });

  it('rejeita título com apenas espaços com 400', async () => {
    const res = await request(app).post('/tasks').send({ title: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('rejeita corpo sem o campo title com 400', async () => {
    const res = await request(app).post('/tasks').send({});

    expect(res.status).toBe(400);
  });

  it('rejeita title de tipo inválido com 400', async () => {
    const res = await request(app).post('/tasks').send({ title: 123 });

    expect(res.status).toBe(400);
  });
});

describe('GET /tasks (2.2 - listar)', () => {
  it('retorna 200 com array vazio quando não há tarefas', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('lista todas as tarefas', async () => {
    await createTask(app, 'A');
    await createTask(app, 'B');

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filtra por status=pending', async () => {
    const a = await createTask(app, 'A');
    await createTask(app, 'B');
    await request(app).patch(`/tasks/${a.id}`).send({ status: 'done' });

    const res = await request(app).get('/tasks?status=pending');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe('pending');
  });

  it('filtra por status=done', async () => {
    const a = await createTask(app, 'A');
    await createTask(app, 'B');
    await request(app).patch(`/tasks/${a.id}`).send({ status: 'done' });

    const res = await request(app).get('/tasks?status=done');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe('done');
  });

  it('rejeita status inválido com 400', async () => {
    const res = await request(app).get('/tasks?status=foo');

    expect(res.status).toBe(400);
  });
});

describe('PATCH /tasks/:id (2.3 - atualizar)', () => {
  it('marca a tarefa como concluída (200)', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app).patch(`/tasks/${task.id}`).send({ status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
    expect(res.body.id).toBe(task.id);
  });

  it('atualiza o título (200)', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app).patch(`/tasks/${task.id}`).send({ title: 'Novo título' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Novo título');
  });

  it('atualiza título e status juntos (200)', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ title: 'X', status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'X', status: 'done' });
  });

  it('faz trim do título ao atualizar', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app).patch(`/tasks/${task.id}`).send({ title: '  Y  ' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Y');
  });

  it('retorna 404 para id inexistente', async () => {
    const res = await request(app).patch('/tasks/nao-existe').send({ status: 'done' });

    expect(res.status).toBe(404);
  });

  it('retorna 400 quando nenhum campo é enviado', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app).patch(`/tasks/${task.id}`).send({});

    expect(res.status).toBe(400);
  });

  it('retorna 400 para status inválido', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app).patch(`/tasks/${task.id}`).send({ status: 'xpto' });

    expect(res.status).toBe(400);
  });

  it('retorna 400 para título vazio', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app).patch(`/tasks/${task.id}`).send({ title: '   ' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /tasks/:id (2.4 - remover)', () => {
  it('remove a tarefa, retorna 200 com a tarefa removida', async () => {
    const task = await createTask(app, 'A');

    const res = await request(app).delete(`/tasks/${task.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(task.id);
  });

  it('a tarefa não aparece mais na listagem após excluir', async () => {
    const task = await createTask(app, 'A');
    await request(app).delete(`/tasks/${task.id}`);

    const list = await request(app).get('/tasks');

    expect(list.body).toHaveLength(0);
  });

  it('retorna 404 para id inexistente', async () => {
    const res = await request(app).delete('/tasks/nao-existe');

    expect(res.status).toBe(404);
  });
});
