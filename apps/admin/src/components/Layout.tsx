import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, HeartHandshake, MessageSquare, LogOut, FileText, UserCog, Send, Building, Menu, X, ShieldAlert } from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Close sidebar on navigation
    setIsMobileOpen(false);
  }, [location]);

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
    navItems.push({ path: '/audit-logs', icon: ShieldAlert, label: 'Audit Logs' });
  }

  return (
    <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
          <img src="/logo.png" alt="ROAACCU Logo" style={{ maxWidth: '160px', height: 'auto' }} />
          {/* Close button inside sidebar for mobile */}
          <button className="mobile-menu-btn d-md-none" onClick={() => setIsMobileOpen(false)} style={{ position: 'absolute', right: '1rem', top: '1.5rem', padding: '0', display: window.innerWidth > 768 ? 'none' : 'block' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: '0 1.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>MENU</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper">
                <item.icon size={18} />
              </div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="desktop-topbar">
          <div className="topbar-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>ROAACCU CONTROL</h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>SMART CREDIT UNION MANAGEMENT</span>
          </div>
          
          <div className="topbar-right">
            <div className="admin-profile-pill">
              <div className="admin-avatar">{admin?.name?.charAt(0) || 'A'}</div>
              <div className="admin-details">
                <span className="admin-name">{admin?.name || 'ADMIN'}</span>
                <span className="admin-role">{admin?.role || 'ADMIN'}</span>
              </div>
              <button onClick={handleLogout} className="logout-icon-btn" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
            <button className="mobile-menu-btn desktop-hide" onClick={() => setIsMobileOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
