import { useProgressStore, readCell } from './useProgressStore';
import { useCellMutation } from './useCellMutation';
import { cellKeys } from './plans';
import { serviceCounts } from './rollups';
import type { CellStatus, CondoPlan, PlanGroup, PlanServico } from './planTypes';
import styles from './ServiceGrid.module.css';

const STAT_LABEL: Record<CellStatus, string> = { 0: 'Não iniciado', 1: 'Em execução', 2: 'Concluído' };

export function ServiceGrid({ plan, group, svc }: { plan: CondoPlan; group: PlanGroup; svc: PlanServico }) {
  const db = useProgressStore((s) => s.db);
  const tap = useCellMutation();
  const cc = serviceCounts(db, plan, group, svc);

  const cell = (key: string, label: string) => {
    const v = readCell(db, plan.id, group.key, svc.item, key);
    return (
      <button
        key={key}
        className={styles.cell}
        data-s={v}
        title={`${label} · ${STAT_LABEL[v]}`}
        onClick={() => tap(plan.id, group.key, svc.item, key)}
      >
        <span className={styles.cellLabel}>{label}</span>
        {v === 2 && <span className={styles.check}>✓</span>}
      </button>
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.tally}>
        <span><i data-s="2" /> {cc.d} concluídos</span>
        <span><i data-s="1" /> {cc.n} em execução</span>
        <span><i data-s="0" /> {cc.i} a iniciar</span>
        <span className={styles.hint}>toque para alternar</span>
      </div>

      {svc.und === 'BL' && (
        <div className={styles.blRow}>{cell('BL', 'Bloco inteiro')}</div>
      )}

      {svc.und === 'Pav' && (
        <div className={styles.pavRow}>
          {(plan.floors ?? []).map((f) => cell(f.k, f.l))}
        </div>
      )}

      {svc.und === 'Apt.' && (
        <div className={styles.floors}>
          {(plan.floors ?? []).map((f) => (
            <div key={f.k} className={styles.floorRow}>
              <span className={styles.floorLabel}>{f.l}</span>
              <div className={styles.aptRow}>
                {(plan.apts ?? []).map((u) => cell(`${f.k}-${u}`, u))}
              </div>
            </div>
          ))}
        </div>
      )}

      {svc.und === 'Casa' && (
        <div className={styles.houses}>
          {cellKeys(plan, group, svc).map((k) => cell(k, k))}
        </div>
      )}
    </div>
  );
}
