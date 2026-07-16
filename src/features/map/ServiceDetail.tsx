import { useProgressStore } from './useProgressStore';
import { serviceFrac, pctOf, statusColor } from './rollups';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ServiceGrid } from './ServiceGrid';
import type { CondoPlan, PlanGroup } from './planTypes';
import styles from './ServiceDetail.module.css';

export function ServiceDetail({ plan, group, item }: { plan: CondoPlan; group: PlanGroup; item: number }) {
  const db = useProgressStore((s) => s.db);
  const svc = plan.servicos.find((s) => s.item === item)!;
  const f = serviceFrac(db, plan, group, svc);
  const col = statusColor(f);
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div className={styles.htext}>
          <span className={styles.kw}>{svc.equipe} · Serviço {svc.item}</span>
          <h2>{svc.descricao}</h2>
        </div>
        <div className={styles.pctBox}>
          <span className={styles.v} style={{ color: col }}>{pctOf(f)}%</span>
          <span className={styles.l}>concluído</span>
        </div>
      </div>
      <ProgressBar value={pctOf(f)} color={col} height={8} />
      <ServiceGrid plan={plan} group={group} svc={svc} />
    </div>
  );
}
