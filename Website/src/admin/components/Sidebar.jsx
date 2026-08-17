import { NavLink } from 'react-router-dom';
import { moduleList } from '../config/modules';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2', end: true },
  ...moduleList.map((m) => ({ to: `/admin/${m.key}`, label: m.label, icon: m.icon })),
  { to: '/admin/settings', label: 'Settings', icon: 'bi-gear' },
];

export default function Sidebar({ open, onNavigate }) {
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
