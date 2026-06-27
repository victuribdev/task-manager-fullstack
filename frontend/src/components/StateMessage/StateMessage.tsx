import type { ReactNode } from 'react';
import styles from './StateMessage.module.css';

interface StateMessageProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function StateMessage({ title, description, action }: StateMessageProps) {
  return (
    <div className={styles.container} role="status">
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
}
