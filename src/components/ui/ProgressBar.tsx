import { useEffect, useRef } from 'react';
import { animateBar } from '@/animations/gsap';
import styles from './ProgressBar.module.css';

interface Props {
  value: number;
  color?: string;
  height?: number;
  animate?: boolean;
}

export function ProgressBar({ value, color = 'var(--accent)', height = 8, animate = true }: Props) {
  const fill = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (fill.current && animate) animateBar(fill.current, value);
  }, [value, animate]);
  return (
    <div className={styles.track} style={{ height }}>
      <div
        ref={fill}
        className={styles.fill}
        style={{ width: animate ? undefined : `${value}%`, background: color }}
      />
    </div>
  );
}
