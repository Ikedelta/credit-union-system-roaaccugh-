import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ShieldAlert, Activity } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/admin/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <ShieldAlert size={28} color="var(--primary-color)" />
        <h2 className="page-title" style={{ margin: 0 }}>System Audit Logs</h2>
      </div>
      
      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin Name</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                </td>
                <td style={{ fontWeight: 500 }}>
                  {log.adminName} <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>(ID: {log.adminId})</span>
                </td>
                <td>
                  <span className="badge" style={{ backgroundColor: 'rgba(28, 16, 94, 0.1)', color: 'var(--primary-color)' }}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {log.details || '—'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                    <Activity size={48} color="var(--border-color)" />
                    No audit logs recorded yet.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
