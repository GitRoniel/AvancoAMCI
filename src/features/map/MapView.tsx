import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PLANS } from './plans';
import { PlanHome } from './PlanHome';
import { GroupView } from './GroupView';
import { DisciplineView } from './DisciplineView';
import { ServiceDetail } from './ServiceDetail';
import { Icon } from '@/components/ui/Icon';
import type { CondominioId } from '@/types';
import styles from './MapView.module.css';

type View =
  | { name: 'home' }
  | { name: 'group'; g: string }
  | { name: 'disc'; g: string; q: string }
  | { name: 'svc'; g: string; q: string; item: number };

export function MapView({ condo }: { condo: CondominioId }) {
  const plan = PLANS[condo];
  const [view, setView] = useState<View>({ name: 'home' });
  const group = 'g' in view ? plan.groups.find((x) => x.key === view.g)! : null;

  const crumb: { label: string; go: () => void }[] = [{ label: plan.nome, go: () => setView({ name: 'home' }) }];
  if (group) crumb.push({ label: group.label, go: () => setView({ name: 'group', g: group.key }) });
  if (view.name === 'disc' || view.name === 'svc') crumb.push({ label: view.q, go: () => setView({ name: 'disc', g: view.g, q: view.q }) });
  if (view.name === 'svc') { const s = plan.servicos.find((x) => x.item === view.item); if (s) crumb.push({ label: s.descricao, go: () => {} }); }

  const back = () => {
    if (view.name === 'svc') setView({ name: 'disc', g: view.g, q: view.q });
    else if (view.name === 'disc') setView({ name: 'group', g: view.g });
    else if (view.name === 'group') setView({ name: 'home' });
  };

  return (
    <div>
      <div className={styles.crumbRow}>
        {view.name !== 'home' && (
          <button className={styles.back} onClick={back}><Icon name="chevron" size={13} style={{ transform: 'rotate(180deg)' }} /> Voltar</button>
        )}
        <nav className={styles.crumb}>
          {crumb.map((c, i) => (
            <span key={i}>
              {i > 0 && <span className={styles.sep}>/</span>}
              {i === crumb.length - 1 ? <b>{c.label}</b> : <button onClick={c.go}>{c.label}</button>}
            </span>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={JSON.stringify(view)}
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {view.name === 'home' && <PlanHome plan={plan} onOpen={(g) => setView({ name: 'group', g: g.key })} />}
          {view.name === 'group' && group && <GroupView plan={plan} group={group} onOpen={(q) => setView({ name: 'disc', g: group.key, q })} />}
          {view.name === 'disc' && group && <DisciplineView plan={plan} group={group} disciplina={view.q} onOpen={(item) => setView({ name: 'svc', g: view.g, q: view.q, item })} />}
          {view.name === 'svc' && group && <ServiceDetail plan={plan} group={group} item={view.item} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
