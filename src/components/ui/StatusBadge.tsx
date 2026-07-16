import { STATUS } from '@/constants/status';
import type { StatusKey } from '@/types';
import styles from './StatusBadge.module.css';

export function StatusBadge({ status, small }: { status: StatusKey; small?: boolean }) {
  const s = STATUS[status];
  return (
    <span className={`${styles.badge} ${small ? styles.small : ''}`} style={{ ['--c' as any]: s.hex }}>
      <span className={styles.dot} />
      {s.label}
    </span>
  );
}
