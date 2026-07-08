import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, CreditCard, HeartHandshake, MessageSquare, CheckCircle, Clock, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const chartData = [
  { name: 'Jan', members: 40, loans: 24 },
  { name: 'Feb', members: 30, loans: 13 },
  { name: 'Mar', members: 20, loans: 98 },
  { name: 'Apr', members: 27, loans: 39 },
  { name: 'May', members: 18, loans: 48 },
  { name: 'Jun', members: 23, loans: 38 },
  { name: 'Jul', members: 34, loans: 43 },
];

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
        <div className="widget" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Users size={20} color="var(--primary-color)" />
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Growth Overview</h3>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1c105e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1c105e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="members" stroke="#1c105e" fillOpacity={1} fill="url(#colorMembers)" name="New Members" />
                <Area type="monotone" dataKey="loans" stroke="#10b981" fillOpacity={1} fill="url(#colorLoans)" name="Loan Applications" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.5rem 1rem' }} onClick={() => navigate('/memberships')}>
            View All Applications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
