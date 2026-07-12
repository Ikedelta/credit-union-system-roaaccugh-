import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, CreditCard, HeartHandshake, MessageSquare, Clock, FileText, Zap, Loader2, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    memberships: 0,
    loans: 0,
    welfare: 0,
    messages: 0,
    smsBalance: "...",
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use allSettled so one failure doesn't break the whole dashboard
        const results = await Promise.allSettled([
          axios.get('/api/admin/memberships'),
          axios.get('/api/admin/loans'),
          axios.get('/api/admin/welfare'),
          axios.get('/api/admin/messages'),
          axios.get('/api/admin/sms/test')
        ]);

        const membershipsRes = results[0].status === 'fulfilled' ? results[0].value.data : [];
        const loansRes = results[1].status === 'fulfilled' ? results[1].value.data : [];
        const welfareRes = results[2].status === 'fulfilled' ? results[2].value.data : [];
        const messagesRes = results[3].status === 'fulfilled' ? results[3].value.data : [];
        const smsTestRes = results[4].status === 'fulfilled' ? results[4].value.data : null;

        // Check if all essential APIs failed (server down or unauthorized)
        if (results.slice(0, 4).every(r => r.status === 'rejected')) {
           setError('Failed to connect to the server or you are not authorized.');
        }

        let balance = 'N/A';
        try {
          if (smsTestRes?.kairos_response) {
             const kr = smsTestRes.kairos_response;
             balance = kr.balance !== undefined ? kr.balance : (kr.data?.balance || kr.data || 'Live');
          }
        } catch(e) {}

        setStats({
          memberships: membershipsRes.length || 0,
          loans: loansRes.length || 0,
          welfare: welfareRes.length || 0,
          messages: messagesRes.length || 0,
          smsBalance: String(balance),
        });

        // Combine and sort recent activity
        let activityList: any[] = [];
        
        if (Array.isArray(loansRes)) {
          loansRes.slice(0, 5).forEach((item: any) => {
            activityList.push({
              icon: CreditCard,
              title: `Loan Request: GH₵ ${item.amount}`,
              time: item.createdAt,
              color: '#10b981',
              bg: 'rgba(16, 185, 129, 0.1)'
            });
          });
        }

        if (Array.isArray(membershipsRes)) {
          membershipsRes.slice(0, 5).forEach((item: any) => {
            activityList.push({
              icon: Users,
              title: `New Membership: ${item.firstName} ${item.lastName}`,
              time: item.createdAt,
              color: '#3b82f6',
              bg: 'rgba(59, 130, 246, 0.1)'
            });
          });
        }

        if (Array.isArray(messagesRes)) {
          messagesRes.slice(0, 5).forEach((item: any) => {
            activityList.push({
              icon: MessageSquare,
              title: `New Message: ${item.subject || 'Contact Form'}`,
              time: item.createdAt,
              color: '#f59e0b',
              bg: 'rgba(245, 158, 11, 0.1)'
            });
          });
        }

        // Sort by newest first
        activityList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setRecentActivity(activityList.slice(0, 5));

      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("An unexpected error occurred while loading dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Memberships', value: stats.memberships, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Loan Applications', value: stats.loans, icon: CreditCard, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Welfare Requests', value: stats.welfare, icon: HeartHandshake, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { title: 'Contact Messages', value: stats.messages, icon: MessageSquare, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
    { title: 'SMS Points / Balance', value: stats.smsBalance, icon: Zap, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  ];

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Overview {loading && <Loader2 className="spinner" size={20} color="var(--primary-color)" />}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Welcome to the ROAACCU Admin Portal.</p>
        </div>
      </div>
      
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card widget" style={{ cursor: 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.3s ease' }}>
            <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              {loading ? (
                <div style={{ height: '24px', width: '50px', backgroundColor: 'var(--border-color)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
              ) : (
                <p className="stat-value">{stat.value}</p>
              )}
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
          
          <div className="activity-list" style={{ minHeight: '200px' }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="activity-item" style={{ opacity: 0.7 }}>
                  <div className="activity-icon" style={{ backgroundColor: 'var(--border-color)' }}></div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <div style={{ height: '16px', width: '70%', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ height: '12px', width: '40%', backgroundColor: 'var(--border-color)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                  </div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon" style={{ backgroundColor: activity.bg, color: activity.color }}>
                    <activity.icon size={18} />
                  </div>
                  <div className="activity-details">
                    <p>{activity.title}</p>
                    <span className="activity-time">{new Date(activity.time).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No recent activity to display.
              </div>
            )}
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
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onClick={() => navigate('/memberships')}>
              <Users size={16} /> Review Pending Memberships
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onClick={() => navigate('/loans')}>
              <CreditCard size={16} /> Process Loan Applications
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onClick={() => navigate('/sms')}>
              <MessageSquare size={16} /> Send SMS Broadcast
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onClick={() => navigate('/cms')}>
              <FileText size={16} /> Update Website Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

