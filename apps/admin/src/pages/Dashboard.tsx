import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, CreditCard, HeartHandshake, MessageSquare, CheckCircle, Clock, FileText, Zap } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    memberships: 0,
    loans: 0,
    welfare: 0,
    messages: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

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

        // Combine and sort recent activity
        let activityList: any[] = [];
        
        loans.data.slice(0, 5).forEach((item: any) => {
          activityList.push({
            icon: CreditCard,
            title: `Loan Request: GH₵ ${item.amount}`,
            time: item.createdAt,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)'
          });
        });

        memberships.data.slice(0, 5).forEach((item: any) => {
          activityList.push({
            icon: Users,
            title: `New Membership: ${item.firstName} ${item.lastName}`,
            time: item.createdAt,
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.1)'
          });
        });

        messages.data.slice(0, 5).forEach((item: any) => {
          activityList.push({
            icon: MessageSquare,
            title: `New Message: ${item.subject || 'Contact Form'}`,
            time: item.createdAt,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)'
          });
        });

        // Sort by newest first
        activityList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setRecentActivity(activityList.slice(0, 5));

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
          <div key={idx} className="stat-card widget" style={{ cursor: 'pointer' }}>
            <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <h3>{stat.title}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-widgets">


        <div className="widget" style={{ display: 'flex', flexDirection: 'column' }}>
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
                  <span className="activity-time">{new Date(activity.time).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.5rem 1rem' }} onClick={() => navigate('/memberships')}>
            View All Applications
          </button>
        </div>

        {/* Quick Actions Column */}
        <div className="widget" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Zap size={20} color="var(--primary-color)" />
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Quick Actions</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/memberships')}>
              <Users size={16} /> Review Pending Memberships
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/loans')}>
              <CreditCard size={16} /> Process Loan Applications
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/sms')}>
              <MessageSquare size={16} /> Send SMS Broadcast
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/cms')}>
              <FileText size={16} /> Update Website Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
