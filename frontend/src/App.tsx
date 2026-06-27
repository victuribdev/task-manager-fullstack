import { useState } from 'react';
import { StatusFilter } from './components/StatusFilter/StatusFilter';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskList } from './components/TaskList/TaskList';
import type { StatusFilter as StatusFilterValue } from './types/task';
import styles from './App.module.css';

export function App() {
  const [filter, setFilter] = useState<StatusFilterValue>('all');

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Task Manager</h1>
          <p className={styles.subtitle}>Organize suas tarefas de forma simples</p>
        </header>
        <TaskForm />
        <StatusFilter value={filter} onChange={setFilter} />
        <TaskList filter={filter} />
      </main>
    </div>
  );
}
