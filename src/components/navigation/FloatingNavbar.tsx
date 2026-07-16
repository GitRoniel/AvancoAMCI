import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, APP_NAME } from '@/constants/app';
import { Icon } from '@/components/ui/Icon';
import { GlobalSearch } from '@/widgets/GlobalSearch';
import { OfflineIndicator } from '@/widgets/OfflineIndicator';
import styles from './FloatingNavbar.module.css';

export function FloatingNavbar() {
  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <span className={styles.logo}><Icon name="building" size={18} /></span>
        <span className={styles.name}>{APP_NAME}</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
            <Icon name={n.icon as any} size={17} />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.right}>
        <OfflineIndicator />
        <GlobalSearch />
      </div>
    </header>
  );
}
