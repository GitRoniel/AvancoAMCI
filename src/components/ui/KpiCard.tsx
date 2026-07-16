import { useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { animateNumber } from '@/animations/gsap';
import styles from './KpiCard.module.css';

interface Props {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  delta?: number;
  hint?: string;
  accent?: string;
}

export function KpiCard({ label, value, suffix = '', decimals = 0, delta, hint, accent = 'var(--accent)' }: Props) {
  const num = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (num.current) animateNumber(num.current, value, { suffix, decimals });
  }, [value, suffix, decimals]);
  return (
    <GlassCard padding="md" className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {delta !== undefined && (
          <span className={delta >= 0 ? styles.up : styles.down}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1).replace('.', ',')}
          </span>
        )}
      </div>
      <div className={styles.value} ref={num} style={{ ['--accent' as any]: accent }}>0{suffix}</div>
      {hint && <span className={styles.hint}>{hint}</span>}
      <div className={styles.glow} style={{ background: accent }} />
    </GlassCard>
  );
}
