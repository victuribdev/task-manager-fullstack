import type { TaskRepository } from './repositories/task.repository';

/**
 * Popula o repositório com algumas tarefas de exemplo no boot.
 * Útil para o ambiente de deploy (dados em memória) não iniciar vazio.
 * Só semeia se ainda não houver tarefas.
 */
export function seedTasks(repository: TaskRepository): void {
  if (repository.findAll().length > 0) {
    return;
  }

  repository.create('Estudar TypeScript');
  repository.create('Revisar pull request');

  const done = repository.create('Configurar o projeto');
  repository.update(done.id, { status: 'done' });
}
