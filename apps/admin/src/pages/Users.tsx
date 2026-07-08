import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAuth();
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/users', { name, email, password, role });
      setUsers([...users, res.data]);
      setName(''); setEmail(''); setPassword(''); setRole('ADMIN');
      alert("User created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (admin?.role !== 'SUPERADMIN') {
    return (
      <div className="widget glass-panel">
        <h3 style={{ color: 'var(--danger)' }}>Access Denied</h3>
        <p>You need SUPERADMIN privileges to view this page.</p>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="page-title">User Management</h2>
      
      <div className="dashboard-widgets" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create User Form */}
        <div className="widget glass-panel">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} /> Add New Admin
          </h3>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
              <label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Create User
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="widget glass-panel table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'SUPERADMIN' ? 'badge-approved' : 'badge-pending'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {admin.id !== u.id && (
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Users;
