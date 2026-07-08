import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, HeartHandshake, MessageSquare, LogOut, FileText, UserCog, Send, Building } from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/memberships', icon: Users, label: 'Memberships' },
    { path: '/loans', icon: CreditCard, label: 'Loans' },
    { path: '/welfare', icon: HeartHandshake, label: 'Welfare' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/cms', icon: FileText, label: 'Website Content' },
    { path: '/sms', icon: Send, label: 'Send SMS' },
  ];

  if (admin?.role === 'SUPERADMIN') {
    navItems.push({ path: '/users', icon: UserCog, label: 'Users' });
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.25rem' }}>
          <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
            <Building size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Admin Portal</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">{admin?.name?.charAt(0)}</div>
            <div className="admin-details">
              <span className="admin-name">{admin?.name}</span>
              <span className="admin-email">{admin?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem' }}>
            <a href="mailto:developer@creditunion.com" style={{ color: 'var(--text-secondary)' }}>
              Contact Developer
            </a>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="header">
          <h3>Credit Union Management System</h3>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
