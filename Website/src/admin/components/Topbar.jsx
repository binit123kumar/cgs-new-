import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const initials = (user?.fullName || user?.username || 'A').slice(0, 1).toUpperCase();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          className="btn btn-light btn-sm"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          onClick={onMenuClick}
        >
          <i className="bi bi-list" />
        </button>
        <div className="topbar-search">
          <i className="bi bi-search" />
          <span>Search...</span>
        </div>
      </div>
      <div className="topbar-right">
        <i className="bi bi-bell" style={{ fontSize: 18, color: '#7a8194' }} />
        <div style={{ position: 'relative' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="avatar-circle">{initials}</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{user?.fullName || 'Administrator'}</div>
              <div style={{ fontSize: 11.5, color: '#7a8194' }}>{user?.role || 'Super Admin'}</div>
            </div>
            <i className="bi bi-chevron-down" style={{ fontSize: 11, color: '#7a8194' }} />
          </div>
          {menuOpen && (
            <div
              style={{
                position: 'absolute', right: 0, top: 46, background: 'white', border: '1px solid var(--border)',
                borderRadius: 10, boxShadow: 'var(--shadow)', width: 160, overflow: 'hidden', zIndex: 20,
              }}
            >
              <button
                onClick={handleLogout}
                style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', fontSize: 13.5, display: 'flex', gap: 8, alignItems: 'center' }}
              >
                <i className="bi bi-box-arrow-right" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
