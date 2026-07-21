import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Check, X, Eye, Search, Trash2 } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Memberships: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/admin/memberships');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await axios.patch(`/api/admin/memberships/${id}/status`, { status });
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
      
      if (res.data.generatedMemberId) {
        alert(`Member Approved Successfully!\n\nMember ID: ${res.data.generatedMemberId}\nTemporary Password: ${res.data.generatedPassword}\n\nPlease share these credentials securely with the member.`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this membership application?')) return;
    try {
      await axios.delete(`/api/admin/memberships/${id}`);
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete application');
    }
  };

  const exportToCsv = () => {
    const headers = ['Date', 'First Name', 'Last Name', 'Email', 'Phone', 'Occupation', 'Status'];
    const csvData = applications.map(app => [
      format(new Date(app.createdAt), 'yyyy-MM-dd'),
      app.firstName,
      app.lastName,
      app.email,
      app.telNo,
      app.occupation,
      app.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'memberships_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LoadingScreen message="Loading memberships..." />;

  const filteredApplications = applications.filter(app => {
    const query = searchQuery.toLowerCase();
    return (
      app.firstName?.toLowerCase().includes(query) ||
      app.lastName?.toLowerCase().includes(query) ||
      app.email?.toLowerCase().includes(query) ||
      app.telNo?.toLowerCase().includes(query) ||
      app.occupation?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Membership Applications</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '35px', width: '250px' }}
            />
          </div>
          <button className="btn btn-outline" onClick={exportToCsv} disabled={applications.length === 0}>
            Export to CSV
          </button>
        </div>
      </div>
      
      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Applicant</th>
              <th>Contact</th>
              <th>Occupation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => (
              <tr key={app.id}>
                <td>{format(new Date(app.createdAt), 'MMM dd, yyyy')}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{app.firstName} {app.lastName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{app.email}</div>
                </td>
                <td>{app.telNo}</td>
                <td>{app.occupation}</td>
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
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Memberships;
