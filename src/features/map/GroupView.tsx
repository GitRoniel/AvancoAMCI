import { useProgressStore } from './useProgressStore';
import { disciplineFrac, disciplineServicos, pctOf } from './rollups';
import { Icon } from '@/components/ui/Icon';
import type { CondoPlan, PlanGroup } from './planTypes';
import styles from './DrillRows.module.css';

export function GroupView({ plan, group, onOpen }: { plan: CondoPlan; group: PlanGroup; onOpen: (disc: string) => void }) {
  const db = useProgressStore((s) => s.db);
  return (
    <div className={styles.list}>
      {plan.disciplinas.map((d) => {
        const f = disciplineFrac(db, plan, group, d.n);
        const n = disciplineServicos(plan, d.n).length;
        const col = `var(${d.c})`;
        return (
          <button key={d.n} className={styles.row} style={{ ['--acc' as any]: col }} onClick={() => onOpen(d.n)}>
            <span className={styles.ic}>{d.n[0]}</span>
            <span className={styles.mid}>
              <span className={styles.name}>{d.n}</span>
              <span className={styles.sub}>{d.d} · {n} serviços</span>
            </span>
            <span className={styles.right}>
              <span className={styles.pct}>{pctOf(f)}%</span>
              <span className={styles.bar}><span style={{ width: `${pctOf(f)}%` }} /></span>
            </span>
            <Icon name="chevron" size={16} />
          </button>
        );
      })}
    </div>
  );
}
