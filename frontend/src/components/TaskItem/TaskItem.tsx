import { memo } from 'react';
import type { Task } from '../../types/task';
import { formatDate } from '../../utils/formatDate';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function TaskItemComponent({ task, onToggle, onDelete, isUpdating, isDeleting }: TaskItemProps) {
  const isDone = task.status === 'done';

  return (
    <li className={styles.item}>
      <div className={styles.content}>
        <span className={isDone ? `${styles.title} ${styles.done}` : styles.title}>
          {task.title}
        </span>
        <div className={styles.meta}>
          <span className={isDone ? `${styles.badge} ${styles.badgeDone}` : styles.badge}>
            {isDone ? 'Concluída' : 'Pendente'}
          </span>
          <time className={styles.date} dateTime={task.createdAt}>
            {formatDate(task.createdAt)}
          </time>
        </div>
      </div>
      <div className={styles.actions}>
        {!isDone && (
          <button
            type="button"
            className={styles.complete}
            onClick={() => onToggle(task)}
            disabled={isUpdating}
          >
            Concluir
          </button>
        )}
        <button
          type="button"
          className={styles.delete}
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
          aria-label={`Excluir tarefa ${task.title}`}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}

export const TaskItem = memo(TaskItemComponent);
