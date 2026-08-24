import { NavLink } from 'react-router-dom';
import { moduleList } from '../config/modules';
import { useAuth } from '../context/AuthContext';

const baseNavItems = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2', end: true },
  ...moduleList.map((m) => ({ to: `/admin/${m.key}`, label: m.label, icon: m.icon })),
  { to: '/admin/activity-log', label: 'Activity Log', icon: 'bi-clock-history' },
  { to: '/admin/settings', label: 'Settings', icon: 'bi-gear' },
];

export default function Sidebar({ open, onNavigate }) {
  const { can, user } = useAuth();
  const navItems = baseNavItems.filter((item) => {
    if (item.to === '/admin' || item.to === '/admin/activity-log') return true;
    return can(item.to.split('/').pop(), 'read');
  });
  if (String(user?.role).toLowerCase() === 'super admin') navItems.push({ to: '/admin/admin-users', label: 'Admin Management', icon: 'bi-shield-lock' });

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="logo-badge">S</div>
        <span>CGS CMS</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <i className={`bi ${item.icon}`} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
