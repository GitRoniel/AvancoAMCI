import { useRef } from 'react';
import { gsap } from 'gsap';
import { useProgressStore } from './useProgressStore';
import { groupFrac, pctOf, statusColor } from './rollups';
import type { CondoPlan, PlanGroup } from './planTypes';
import styles from './PlanHome.module.css';

export function PlanHome({ plan, onOpen }: { plan: CondoPlan; onOpen: (g: PlanGroup) => void }) {
  const db = useProgressStore((s) => s.db);
  const stageRef = useRef<HTMLDivElement>(null);

  const openWithZoom = (g: PlanGroup, el: HTMLElement) => {
    // Interactive zoom: briefly scale the stage toward the tapped hotspot.
    if (plan.image && g.hotspot && stageRef.current) {
      const hs = g.hotspot;
      const ox = hs.x + hs.w / 2, oy = hs.y + hs.h / 2;
      const tl = gsap.timeline({ onComplete: () => onOpen(g) });
      tl.to(stageRef.current, { transformOrigin: `${ox}% ${oy}%`, scale: 2.1, duration: 0.5, ease: 'power3.inOut' })
        .to(stageRef.current, { opacity: 0, duration: 0.15 }, '-=0.12')
        .set(stageRef.current, { scale: 1, opacity: 1, clearProps: 'transform' });
    } else {
      gsap.fromTo(el, { scale: 1 }, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, onComplete: () => onOpen(g) });
    }
  };

  // M01 — real plan image + hotspots
  if (plan.image) {
    return (
      <div className={styles.mapcard}>
        <div className={styles.stage} ref={stageRef}>
          <img src={plan.image} alt={`Planta ${plan.nome}`} draggable={false} />
          {plan.groups.map((g) => {
            const f = groupFrac(db, plan, g);
            const hs = g.hotspot!;
            return (
              <button
                key={g.key}
                className={styles.hot}
                style={{ left: `${hs.x}%`, top: `${hs.y}%`, width: `${hs.w}%`, height: `${hs.h}%` }}
                onClick={(e) => openWithZoom(g, e.currentTarget)}
              >
                <span className={styles.fr} style={{ boxShadow: `inset 0 0 0 2px ${statusColor(f)}` }} />
                <span className={styles.tag}>
                  {g.key}
                  <span className={styles.pct} style={{ color: statusColor(f) }}>{pctOf(f)}%</span>
                </span>
                <span className={styles.pb}><span style={{ width: `${pctOf(f)}%`, background: statusColor(f) }} /></span>
                {(['tl', 'tr', 'bl', 'br'] as const).map((c) => <span key={c} className={`${styles.c} ${styles[c]}`} />)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // C03 — schematic clickable conjuntos
  return (
    <div className={styles.schematic}>
      {plan.groups.map((g) => {
        const f = groupFrac(db, plan, g);
        return (
          <button key={g.key} className={styles.schemCard} onClick={(e) => openWithZoom(g, e.currentTarget)}
            style={{ ['--c' as any]: statusColor(f) }}>
            <div className={styles.schemTop}>
              <span className={styles.schemKey}>{g.key}</span>
              <span className={styles.schemPct}>{pctOf(f)}%</span>
            </div>
            <div className={styles.schemLabel}>{g.label}</div>
            <div className={styles.schemCasas}>{g.casas?.length ?? 0} casas</div>
            <div className={styles.schemBar}><span style={{ width: `${pctOf(f)}%` }} /></div>
          </button>
        );
      })}
    </div>
  );
}
