import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { buildLayout, type MapLayout } from './mapLayout';
import { STATUS } from '@/constants/status';
import { useSelectionStore } from '@/stores/useSelectionStore';
import type { CondominioId, Unidade } from '@/types';
import { pct } from '@/utils/format';
import styles from './CondoMap.module.css';

interface Props {
  units: Unidade[];
  condominio: CondominioId;
}

interface Tip { x: number; y: number; unit: Unidade }

export function CondoMap({ units, condominio }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layout: MapLayout = useMemo(
    () => buildLayout(units, condominio),
    [units, condominio],
  );
  const select = useSelectionStore((s) => s.select);
  const selectedId = useSelectionStore((s) => s.selectedUnitId);
  const sheetOpen = useSelectionStore((s) => s.bottomSheetOpen);
  const [tip, setTip] = useState<Tip | null>(null);
  const viewRef = useRef({ x: 0, y: 0, w: layout.width, h: layout.height });

  const fullView = () => ({ x: 0, y: 0, w: layout.width, h: layout.height });

  // Reset view when condo / dataset changes.
  useEffect(() => {
    const v = fullView();
    viewRef.current = v;
    if (svgRef.current) svgRef.current.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condominio, layout.width, layout.height]);

  const animateTo = (target: { x: number; y: number; w: number; h: number }) => {
    const cur = viewRef.current;
    gsap.to(cur, {
      ...target, duration: 0.7, ease: 'power3.inOut',
      onUpdate: () => {
        svgRef.current?.setAttribute('viewBox', `${cur.x} ${cur.y} ${cur.w} ${cur.h}`);
      },
    });
  };

  const handleClick = (unit: Unidade, cell: { x: number; y: number; w: number; h: number }) => {
    const pad = 120;
    animateTo({ x: cell.x - pad, y: cell.y - pad, w: cell.w + pad * 2, h: cell.h + pad * 2 });
    select(unit.id);
    setTip(null);
  };

  const resetZoom = () => animateTo(fullView());

  // When the sheet closes, zoom back out.
  useEffect(() => {
    if (!sheetOpen) resetZoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen]);

  const dimmed = sheetOpen && selectedId;

  return (
    <div className={styles.wrap}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        preserveAspectRatio="xMidYMid meet"
        onDoubleClick={resetZoom}
      >
        <defs>
          <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity="0.5" />
          </filter>
        </defs>

        {layout.groups.map((g) => (
          <g key={g.key} className={styles.group}>
            <rect
              x={g.x} y={g.y} width={g.w} height={g.h} rx={14}
              className={styles.groupBg}
              opacity={dimmed ? 0.25 : 1}
            />
            <text x={g.x + 14} y={g.y + 18} className={styles.groupLabel} opacity={dimmed ? 0.3 : 1}>
              {g.label}
            </text>

            {g.cells.map((c) => {
              const isSel = c.unit.id === selectedId;
              const s = STATUS[c.unit.status];
              return (
                <g
                  key={c.unit.id}
                  data-id={c.unit.id}
                  data-status={c.unit.status}
                  className={styles.unit}
                  transform={`translate(${c.x} ${c.y})`}
                  opacity={dimmed && !isSel ? 0.16 : 1}
                  onClick={() => handleClick(c.unit, c)}
                  onMouseEnter={(e) => {
                    const r = (e.currentTarget as SVGGElement).getBoundingClientRect();
                    setTip({ x: r.left + r.width / 2, y: r.top, unit: c.unit });
                  }}
                  onMouseLeave={() => setTip(null)}
                >
                  <rect
                    width={c.w} height={c.h} rx={7}
                    fill={s.hex}
                    fillOpacity={0.9}
                    stroke={isSel ? '#fff' : 'rgba(0,0,0,0.25)'}
                    strokeWidth={isSel ? 2 : 1}
                    filter="url(#mapShadow)"
                    className={styles.cell}
                  />
                  <text x={c.w / 2} y={c.h / 2 + 3.5} className={styles.cellText}>
                    {c.unit.unidade}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>

      {tip && (
        <div
          className={styles.tooltip}
          style={{ left: tip.x, top: tip.y }}
        >
          <strong>{tip.unit.condominioNome}</strong>
          <span>{tip.unit.bloco ? `Bloco ${tip.unit.bloco}` : `Conj. ${tip.unit.conjunto}`} · {tip.unit.unidade}</span>
          <span className={styles.tipPct} style={{ color: STATUS[tip.unit.status].hex }}>
            {pct(tip.unit.percentual, 1)} · {STATUS[tip.unit.status].label}
          </span>
        </div>
      )}

      <button className={styles.resetBtn} onClick={resetZoom}>Ver tudo</button>
    </div>
  );
}
