import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useCreateTask } from '../../hooks/useCreateTask';
import styles from './TaskForm.module.css';

export function TaskForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createTask = useCreateTask();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setError('O título não pode ser vazio');
      return;
    }

    createTask.mutate(
      { title: trimmed },
      { onSuccess: () => setTitle('') },
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          placeholder="Nova tarefa..."
          value={title}
          onChange={handleChange}
          aria-label="Título da tarefa"
          aria-invalid={error !== null}
        />
        <button className={styles.button} type="submit" disabled={createTask.isPending}>
          {createTask.isPending ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {createTask.isError && (
        <p className={styles.error}>Não foi possível criar a tarefa. Tente novamente.</p>
      )}
    </form>
  );
}
