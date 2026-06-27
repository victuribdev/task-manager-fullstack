import { createApp } from './app';
import { env } from './config/env';
import { taskRepository } from './repositories/task.repository';
import { seedTasks } from './seed';

seedTasks(taskRepository);

const app = createApp();

app.listen(env.port, () => {
  console.log(`🚀 API rodando em http://localhost:${env.port}`);
});
