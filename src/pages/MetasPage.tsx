import { useMemo } from 'react';
import { useSnapshot } from '@/hooks/useSnapshot';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { avgPercent } from '@/utils/aggregate';
import { pct } from '@/utils/format';
import { STATUS } from '@/constants/status';
import styles from './MetasPage.module.css';

// Demo goals — in production these come from the "Metas" sheet.
const METAS = [
  { id: 'g1', escopo: 'Global', alvo: 'Todos', periodo: 'Mensal', valorMeta: 65 },
  { id: 'g2', escopo: 'Condomínio', alvo: 'C03', periodo: 'Mensal', valorMeta: 70 },
  { id: 'g3', escopo: 'Condomínio', alvo: 'M01', periodo: 'Mensal', valorMeta: 60 },
  { id: 'g4', escopo: 'Semanal', alvo: 'Todos', periodo: 'Semanal', valorMeta: 4 },
];

export default function MetasPage() {
  const { data, isLoading } = useSnapshot();
  const executed = useMemo(() => {
    const u = data?.unidades ?? [];
    return {
      Todos: avgPercent(u),
      C03: avgPercent(u.filter((x) => x.condominio === 'C03')),
      M01: avgPercent(u.filter((x) => x.condominio === 'M01')),
    } as Record<string, number>;
  }, [data]);
  if (isLoading) return <Spinner label="Carregando metas…" />;

  return (
    <>
      <PageHeader title="Metas" subtitle="Meta × Executado × Diferença × Tendência" />
      <div className={styles.grid}>
        {METAS.map((m) => {
          const exec = m.periodo === 'Semanal' ? 3.6 : (executed[m.alvo] ?? 0);
          const diff = exec - m.valorMeta;
          const ratio = Math.min(100, (exec / m.valorMeta) * 100);
          const onTrack = diff >= 0;
          return (
            <GlassCard key={m.id} padding="lg" className={styles.card}>
              <div className={styles.top}>
                <div>
                  <h3>{m.escopo} · {m.alvo}</h3>
                  <span className={styles.period}>{m.periodo}</span>
                </div>
                <span className={styles.trend} style={{ color: STATUS[onTrack ? 'concluido' : 'atrasado'].hex }}>
                  {onTrack ? '▲ no ritmo' : '▼ atrás'}
                </span>
              </div>
              <div className={styles.numbers}>
                <div><span>Meta</span><strong>{m.periodo === 'Semanal' ? m.valorMeta + ' pts' : pct(m.valorMeta)}</strong></div>
                <div><span>Executado</span><strong>{m.periodo === 'Semanal' ? exec.toFixed(1) + ' pts' : pct(exec, 1)}</strong></div>
                <div><span>Diferença</span><strong style={{ color: STATUS[onTrack ? 'concluido' : 'atrasado'].hex }}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}</strong></div>
              </div>
              <ProgressBar value={ratio} color={STATUS[onTrack ? 'concluido' : 'atencao'].hex} height={10} />
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}
