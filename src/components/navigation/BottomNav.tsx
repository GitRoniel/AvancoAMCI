import { NavLink } from 'react-router-dom';
import { BOTTOM_NAV } from '@/constants/app';
import { Icon } from '@/components/ui/Icon';
import styles from './BottomNav.module.css';

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      {BOTTOM_NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.to === '/'}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
          <Icon name={n.icon as any} size={22} />
          <span>{n.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
