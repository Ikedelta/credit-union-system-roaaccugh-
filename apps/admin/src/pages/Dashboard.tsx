import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, CreditCard, HeartHandshake, MessageSquare } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
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
    { title: 'Total Memberships', value: stats.memberships, icon: Users, color: 'text-blue-500' },
    { title: 'Loan Applications', value: stats.loans, icon: CreditCard, color: 'text-green-500' },
    { title: 'Welfare Requests', value: stats.welfare, icon: HeartHandshake, color: 'text-purple-500' },
    { title: 'Contact Messages', value: stats.messages, icon: MessageSquare, color: 'text-orange-500' },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="page-title">Overview</h2>
      
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card glass-panel">
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className="stat-icon">
              <stat.icon size={32} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-widgets">
        <div className="widget glass-panel">
          <h3>Welcome to the Admin Portal</h3>
          <p>Select a category from the sidebar to manage applications and messages. You can approve or reject pending requests.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
