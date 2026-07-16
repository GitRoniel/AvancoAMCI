import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { sheetVariants } from '@/animations/variants';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useSnapshot, useUpdateServico } from '@/hooks/useSnapshot';
import { useUIStore } from '@/stores/useUIStore';
import { STATUS } from '@/constants/status';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Icon } from '@/components/ui/Icon';
import { pct, formatDate } from '@/utils/format';
import type { UnitServico } from '@/types';
import styles from './UnitBottomSheet.module.css';

export function UnitBottomSheet() {
  const { selectedUnitId, bottomSheetOpen, close } = useSelectionStore();
  const { data } = useSnapshot();
  const unit = useMemo(
    () => data?.unidades.find((u) => u.id === selectedUnitId),
    [data, selectedUnitId],
  );
  const [editing, setEditing] = useState<UnitServico | null>(null);

  return (
    <AnimatePresence>
      {bottomSheetOpen && unit && (
        <>
          <motion.div
            className={styles.scrim}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.section
            className={styles.sheet}
            variants={sheetVariants}
            initial="hidden" animate="visible" exit="exit"
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2}
            onDragEnd={(_e, info) => { if (info.offset.y > 120) close(); }}
          >
            <div className={styles.grabber} />
            <header className={styles.header}>
              <div>
                <h2 className={styles.title}>
                  {unit.bloco ? `Bloco ${unit.bloco}` : `Conjunto ${unit.conjunto}`} · {unit.unidade}
                </h2>
                <p className={styles.sub}>{unit.condominioNome} · {unit.condominio}</p>
              </div>
              <button className={styles.closeBtn} onClick={close} aria-label="Fechar">
                <Icon name="close" size={18} />
              </button>
            </header>

            <div className={styles.overall}>
              <div className={styles.overallTop}>
                <span>Percentual geral</span>
                <strong style={{ color: STATUS[unit.status].hex }}>{pct(unit.percentual, 1)}</strong>
              </div>
              <ProgressBar value={unit.percentual} color={STATUS[unit.status].hex} height={10} />
              <div className={styles.legendRow}><StatusBadge status={unit.status} /></div>
            </div>

            <div className={styles.listHead}>
              <span>Serviços</span><span>{unit.servicos.length}</span>
            </div>
            <ul className={styles.list}>
              {unit.servicos.map((s) => (
                <li key={s.servicoItem} className={styles.item}>
                  <div className={styles.itemMain}>
                    <div className={styles.itemName}>
                      <span className={styles.dot} style={{ background: STATUS[s.status].hex }} />
                      {s.nome}
                    </div>
                    <div className={styles.itemMeta}>
                      {s.equipe} · {s.responsavel} · {formatDate(s.data)}
                    </div>
                    <ProgressBar value={s.percentual} color={STATUS[s.status].hex} height={6} />
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemPct}>{pct(s.percentual)}</span>
                    <button className={styles.updateBtn} onClick={() => setEditing(s)}>
                      Atualizar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {editing && unit && (
            <UpdateDialog
              unitId={unit.id}
              servico={editing}
              onClose={() => setEditing(null)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}

function UpdateDialog({ unitId, servico, onClose }: { unitId: string; servico: UnitServico; onClose: () => void }) {
  const [value, setValue] = useState(servico.percentual);
  const [obs, setObs] = useState('');
  const update = useUpdateServico();
  const showToast = useUIStore((s) => s.showToast);

  const save = async () => {
    try {
      const res: any = await update.mutateAsync({
        unidadeId: unitId, servicoItem: servico.servicoItem,
        novoValor: value, usuario: 'anaiscolas', obs,
      });
      showToast(res?.queued ? 'Salvo offline — sincroniza ao reconectar' : 'Serviço atualizado', 'ok');
      onClose();
    } catch {
      showToast('Falha ao atualizar', 'error');
    }
  };

  return (
    <motion.div className={styles.dialogScrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className={styles.dialog}
        initial={{ scale: 0.94, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{servico.nome}</h3>
        <div className={styles.sliderRow}>
          <input type="range" min={0} max={100} step={5} value={value} onChange={(e) => setValue(Number(e.target.value))} />
          <span className={styles.sliderVal}>{value}%</span>
        </div>
        <ProgressBar value={value} animate={false} height={8} />
        <textarea placeholder="Observação (opcional)" value={obs} onChange={(e) => setObs(e.target.value)} />
        <div className={styles.dialogActions}>
          <button className={styles.ghost} onClick={onClose}>Cancelar</button>
          <button className={styles.primary} onClick={save} disabled={update.isPending}>
            {update.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
