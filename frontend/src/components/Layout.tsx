import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icons } from './Icons';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">{Icons.leaf}</div>
          <span className="brand-name">Nido</span>
        </div>

        <span className="nav-label">Principal</span>
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {Icons.explore} Explorar
        </NavLink>
        <NavLink to="/reservations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {Icons.reservation} Mis reservas
        </NavLink>

        {isAdmin && (
          <>
            <span className="nav-label">Admin</span>
            <NavLink to="/spaces" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {Icons.space} Espacios
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {Icons.users} Usuarios
            </NavLink>
            <NavLink to="/admin/reservations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {Icons.reservation} Reservaciones
            </NavLink>
          </>
        )}

        <div className="sidebar-bottom">
          <div className="user-pill">
            <div className="avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Cerrar sesion">
              {Icons.logout}
            </button>
          </div>
        </div>
      </aside>

      <header className="topbar">
        <div className="search-box">
          {Icons.search}
          <input type="text" placeholder="Buscar espacios..." />
        </div>
        <div className="topbar-actions">
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowNotifs(!showNotifs)}>
              {Icons.bell}
              <span className="badge" />
            </button>
            {showNotifs && (
              <div className="notif-panel open">
                <div className="notif-header">Notificaciones</div>
                <div className="notif-item">
                  <div className="notif-dot success" />
                  <div>
                    <div className="notif-text">Bienvenido a Nido Coworking</div>
                    <div className="notif-time">Ahora</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="view-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
