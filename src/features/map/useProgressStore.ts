import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CellStatus } from './planTypes';

/**
 * Tri-state progress DB:  progress[condo][groupKey][serviceItem][cellKey] = 0|1|2
 * Persisted locally (localStorage; mirrored to Capacitor Preferences via the
 * sync layer). Mutations are also queued to the backend when configured.
 */
type DB = Record<string, Record<string, Record<number, Record<string, CellStatus>>>>;

interface ProgressState {
  db: DB;
  seeded: boolean;
  cycle: (condo: string, group: string, item: number, cell: string) => void;
  setCell: (condo: string, group: string, item: number, cell: string, v: CellStatus) => void;
  setMany: (entries: { condo: string; group: string; item: number; cell: string; v: CellStatus }[]) => void;
  markSeeded: () => void;
  reset: () => void;
}

const nextStatus = (v: CellStatus): CellStatus => ((v + 1) % 3) as CellStatus;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      db: {},
      seeded: false,
      cycle: (condo, group, item, cell) => {
        const cur = get().db?.[condo]?.[group]?.[item]?.[cell] ?? 0;
        get().setCell(condo, group, item, cell, nextStatus(cur));
      },
      setCell: (condo, group, item, cell, v) =>
        set((s) => {
          const db = structuredClone(s.db) as DB;
          (((db[condo] ??= {})[group] ??= {})[item] ??= {})[cell] = v;
          return { db };
        }),
      setMany: (entries) =>
        set((s) => {
          const db = structuredClone(s.db) as DB;
          for (const e of entries) (((db[e.condo] ??= {})[e.group] ??= {})[e.item] ??= {})[e.cell] = e.v;
          return { db };
        }),
      markSeeded: () => set({ seeded: true }),
      reset: () => set({ db: {}, seeded: false }),
    }),
    { name: 'avanco.progress.v1', storage: createJSONStorage(() => localStorage) },
  ),
);

/** Read a single cell status. */
export const readCell = (db: DB, condo: string, group: string, item: number, cell: string): CellStatus =>
  db?.[condo]?.[group]?.[item]?.[cell] ?? 0;
