import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ role = 'patient' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = role === 'doctor'
    ? [['/doctor', 'Dashboard']]
    : [
      ['/dashboard', 'Dashboard'], ['/readings/new', 'Add Reading'],
      ['/readings', 'Reading History'], ['/reports', 'Reports'], ['/profile', 'Profile']
    ];

  const signOut = () => { logout(); navigate('/login'); };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to={role === 'doctor' ? '/doctor' : '/dashboard'}>
          <span className="brand-mark">S</span><span>Sweety</span>
        </NavLink>
        <nav className="side-nav">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/dashboard' || to === '/doctor'}>{label}</NavLink>
          ))}
        </nav>
        <button className="logout-link" onClick={signOut}>Logout</button>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div>
            <strong>{user?.full_name}</strong>
            <small className="d-block text-muted">{role === 'doctor' ? 'Doctor' : 'Patient'}</small>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
