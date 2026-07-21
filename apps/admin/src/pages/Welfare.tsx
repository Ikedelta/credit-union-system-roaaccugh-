import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ShieldPlus, FileText, CheckCircle, XCircle, Check, X, Search, Trash2 } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Welfare: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/admin/welfare');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`/api/admin/welfare/${id}/status`, { status });
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this welfare application?')) return;
    try {
      await axios.delete(`/api/admin/welfare/${id}`);
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete application');
    }
  };

  if (loading) return <LoadingScreen message="Loading welfare data..." />;

  const filteredApplications = applications.filter(app => {
    const query = searchQuery.toLowerCase();
    return (
      app.name?.toLowerCase().includes(query) ||
      app.contact?.toLowerCase().includes(query) ||
      app.accountNumber?.toLowerCase().includes(query) ||
      app.beneficiaryName?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Welfare Requests</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search welfare..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '35px', width: '250px' }}
            />
          </div>
        </div>
      </div>
      
      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Applicant</th>
              <th>Contact</th>
              <th>Beneficiary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => (
              <tr key={app.id}>
                <td>{format(new Date(app.createdAt), 'MMM dd, yyyy')}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{app.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Acc: {app.accountNumber || 'N/A'}</div>
                </td>
                <td>{app.contact}</td>
                <td>{app.beneficiaryName || 'N/A'}</td>
                <td>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {app.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => updateStatus(app.id, 'APPROVED')}
                          className="btn btn-success" 
                          style={{ padding: '0.25rem 0.5rem' }}
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => updateStatus(app.id, 'REJECTED')}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem' }}
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDelete(app.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No welfare requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Welfare;
