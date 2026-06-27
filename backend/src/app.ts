import cors from 'cors';
import express, { type Express } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { taskRouter } from './routes/task.routes';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/tasks', taskRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
