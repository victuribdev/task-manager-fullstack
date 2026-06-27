import { useCallback } from 'react';
import { useDeleteTask } from '../../hooks/useDeleteTask';
import { useTasks } from '../../hooks/useTasks';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import type { StatusFilter, Task } from '../../types/task';
import { StateMessage } from '../StateMessage/StateMessage';
import { TaskItem } from '../TaskItem/TaskItem';
import styles from './TaskList.module.css';

interface TaskListProps {
  filter: StatusFilter;
}

export function TaskList({ filter }: TaskListProps) {
  const { data: tasks, isPending, isError, refetch } = useTasks(filter);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleToggle = useCallback(
    (task: Task) => {
      updateTask.mutate({ id: task.id, payload: { status: 'done' } });
    },
    [updateTask],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteTask.mutate(id);
    },
    [deleteTask],
  );

  if (isPending) {
    return <StateMessage title="Carregando tarefas..." />;
  }

  if (isError) {
    return (
      <StateMessage
        title="Erro ao carregar tarefas"
        description="Verifique se a API está rodando e tente novamente."
        action={
          <button type="button" className={styles.retry} onClick={() => void refetch()}>
            Tentar novamente
          </button>
        }
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <StateMessage
        title="Nenhuma tarefa por aqui"
        description="Crie sua primeira tarefa no campo acima."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={handleToggle}
          onDelete={handleDelete}
          isUpdating={updateTask.isPending}
          isDeleting={deleteTask.isPending}
        />
      ))}
    </ul>
  );
}
