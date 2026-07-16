import type { HTMLAttributes, ReactNode } from 'react';
import styles from './GlassCard.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strong?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function GlassCard({ children, strong, padding = 'md', className = '', ...rest }: Props) {
  return (
    <div
      className={`${styles.card} ${strong ? styles.strong : ''} ${styles[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
