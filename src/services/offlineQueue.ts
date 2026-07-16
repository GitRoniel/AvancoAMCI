/**
 * Offline write queue backed by Capacitor Preferences (falls back to
 * localStorage on web). Mutations made while offline are persisted and
 * flushed automatically when connectivity returns.
 */
import { Preferences } from '@capacitor/preferences';
import { sheetsApi } from '@/api/sheetsApi';
import { USE_LIVE_BACKEND } from '@/constants/app';

const KEY = 'avanco.offline.queue';

interface QueuedOp {
  id: string;
  type: 'updateServico';
  payload: any;
  ts: number;
}

async function read(): Promise<QueuedOp[]> {
  const { value } = await Preferences.get({ key: KEY });
  return value ? JSON.parse(value) : [];
}
async function write(ops: QueuedOp[]) {
  await Preferences.set({ key: KEY, value: JSON.stringify(ops) });
}

export const offlineQueue = {
  async enqueue(op: { type: 'updateServico'; payload: any }) {
    const ops = await read();
    ops.push({ ...op, id: crypto.randomUUID(), ts: Date.now() });
    await write(ops);
  },
  async size() {
    return (await read()).length;
  },
  async flush() {
    if (!USE_LIVE_BACKEND || !navigator.onLine) return 0;
    const ops = await read();
    if (!ops.length) return 0;
    const remaining: QueuedOp[] = [];
    for (const op of ops) {
      try {
        await sheetsApi.updateServico(op.payload);
      } catch {
        remaining.push(op);
      }
    }
    await write(remaining);
    return ops.length - remaining.length;
  },
};

/** Register the auto-flush listener once at app boot. */
export function registerOfflineSync() {
  const tryFlush = () => offlineQueue.flush().catch(() => {});
  window.addEventListener('online', tryFlush);
  tryFlush();
}
