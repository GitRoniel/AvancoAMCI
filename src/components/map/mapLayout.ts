import type { Unidade, CondominioId } from '@/types';

export interface Cell {
  unit: Unidade;
  x: number; y: number; w: number; h: number;
}
export interface Group {
  key: string;
  label: string;
  x: number; y: number; w: number; h: number;
  cells: Cell[];
}
export interface MapLayout {
  groups: Group[];
  width: number;
  height: number;
}

const CELL = 34;
const GAP = 5;
const GROUP_PAD = 14;
const GROUP_GAP_X = 26;
const GROUP_GAP_Y = 30;
const LABEL_H = 20;

/**
 * Schematic, data-driven layout: each conjunto (C03) / bloco (M01) becomes a
 * cluster; each unit is an independent cell. Groups flow left-to-right and wrap.
 */
export function buildLayout(
  units: Unidade[],
  condominio: CondominioId,
  maxWidth = 1180,
): MapLayout {
  const groupKey = (u: Unidade) => (condominio === 'M01' ? u.bloco! : u.conjunto!);
  const map = new Map<string, Unidade[]>();
  for (const u of units) {
    const k = groupKey(u);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(u);
  }
  const orderedKeys = [...map.keys()].sort();

  const groups: Group[] = [];
  let cursorX = GROUP_GAP_X;
  let cursorY = GROUP_GAP_Y;
  let rowMaxH = 0;

  for (const key of orderedKeys) {
    const list = map.get(key)!.slice().sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt', { numeric: true }));
    const cols = Math.min(list.length, condominio === 'M01' ? 8 : 6);
    const rows = Math.ceil(list.length / cols);
    const innerW = cols * CELL + (cols - 1) * GAP;
    const innerH = rows * CELL + (rows - 1) * GAP;
    const gW = innerW + GROUP_PAD * 2;
    const gH = innerH + GROUP_PAD * 2 + LABEL_H;

    if (cursorX + gW > maxWidth) {
      cursorX = GROUP_GAP_X;
      cursorY += rowMaxH + GROUP_GAP_Y;
      rowMaxH = 0;
    }

    const cells: Cell[] = list.map((unit, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return {
        unit,
        x: cursorX + GROUP_PAD + c * (CELL + GAP),
        y: cursorY + GROUP_PAD + LABEL_H + r * (CELL + GAP),
        w: CELL, h: CELL,
      };
    });

    groups.push({
      key: condominio === 'M01' ? `Bloco ${key}` : `Conj. ${key}`,
      label: condominio === 'M01' ? `BL ${key}` : `CONJ ${key}`,
      x: cursorX, y: cursorY, w: gW, h: gH, cells,
    });

    cursorX += gW + GROUP_GAP_X;
    rowMaxH = Math.max(rowMaxH, gH);
  }

  const width = maxWidth;
  const height = cursorY + rowMaxH + GROUP_GAP_Y;
  return { groups, width, height };
}
