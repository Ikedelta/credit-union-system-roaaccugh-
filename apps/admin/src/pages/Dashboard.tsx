import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, CreditCard, HeartHandshake, MessageSquare, CheckCircle, Clock, FileText } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    memberships: 0,
    loans: 0,
    welfare: 0,
    messages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [memberships, loans, welfare, messages] = await Promise.all([
          axios.get('/api/admin/memberships'),
          axios.get('/api/admin/loans'),
          axios.get('/api/admin/welfare'),
          axios.get('/api/admin/messages'),
        ]);

        setStats({
          memberships: memberships.data.length,
          loans: loans.data.length,
          welfare: welfare.data.length,
          messages: messages.data.length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Memberships', value: stats.memberships, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Loan Applications', value: stats.loans, icon: CreditCard, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Welfare Requests', value: stats.welfare, icon: HeartHandshake, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { title: 'Contact Messages', value: stats.messages, icon: MessageSquare, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  ];

  const recentActivity = [
    { icon: Users, title: 'New Membership Application', time: '2 hours ago', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { icon: CreditCard, title: 'Loan Request: GHS 5,000', time: '5 hours ago', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { icon: MessageSquare, title: 'New message from Contact Form', time: '1 day ago', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  ];

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Overview</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to the ROAACCU Admin Portal.</p>
        </div>
      </div>
      
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card glass-panel" style={{ cursor: 'pointer' }}>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-widgets">
        <div className="widget glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <FileText size={20} color="var(--primary-color)" />
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Recent Activity</h3>
          </div>
          
          <div className="activity-list">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: activity.bg, color: activity.color }}>
                  <activity.icon size={18} />
                </div>
                <div className="activity-details">
                  <p>{activity.title}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.5rem 1rem' }} onClick={() => navigate('/memberships')}>
            View All Applications
          </button>
        </div>

        <div className="widget glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <CheckCircle size={20} color="var(--success)" />
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>System Status</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>API Connection</span>
              <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span> Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Database</span>
              <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span> Postgres Ready</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Last Backup</span>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> Today, 2:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
