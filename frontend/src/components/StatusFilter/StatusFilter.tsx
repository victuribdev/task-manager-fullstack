import { memo } from 'react';
import type { StatusFilter as StatusFilterValue } from '../../types/task';
import styles from './StatusFilter.module.css';

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

const OPTIONS: ReadonlyArray<{ label: string; value: StatusFilterValue }> = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Concluídas', value: 'done' },
];

function StatusFilterComponent({ value, onChange }: StatusFilterProps) {
  return (
    <div className={styles.filter} role="tablist" aria-label="Filtrar tarefas por status">
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const StatusFilter = memo(StatusFilterComponent);
