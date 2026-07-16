import { useProgressStore } from './useProgressStore';
import { disciplineServicos, serviceFrac, serviceCounts, pctOf, statusColor } from './rollups';
import { Icon } from '@/components/ui/Icon';
import type { CondoPlan, PlanGroup } from './planTypes';
import styles from './DrillRows.module.css';

export function DisciplineView({ plan, group, disciplina, onOpen }: {
  plan: CondoPlan; group: PlanGroup; disciplina: string; onOpen: (item: number) => void;
}) {
  const db = useProgressStore((s) => s.db);
  const list = disciplineServicos(plan, disciplina);
  return (
    <div className={styles.list}>
      {list.map((s) => {
        const f = serviceFrac(db, plan, group, s);
        const cc = serviceCounts(db, plan, group, s);
        const col = statusColor(f);
        return (
          <button key={s.item} className={styles.svcRow} onClick={() => onOpen(s.item)}>
            <span className={styles.svcNum}>{s.item}</span>
            <span className={styles.mid}>
              <span className={styles.svcName}>{s.descricao}</span>
              <span className={styles.svcBar}><span style={{ width: `${pctOf(f)}%`, background: col }} /></span>
            </span>
            <span className={styles.svcRight}>
              <span className={styles.pct} style={{ color: col }}>{pctOf(f)}%</span>
              <span className={styles.und}>{s.und === 'Apt.' ? 'Apto' : s.und} · {cc.t}</span>
            </span>
            <Icon name="chevron" size={15} />
          </button>
        );
      })}
    </div>
  );
}
