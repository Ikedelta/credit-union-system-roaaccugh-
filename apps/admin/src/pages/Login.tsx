import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2, Mail, Lock } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/admin/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.admin);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <img src="/logo.png" alt="ROAACCU Logo" />
          </div>
          <h1>Admin Login</h1>
          <p>Login to manage ROAACCU</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@roaaccugh.com"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Login Now ↗'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Having issues with the system?</p>
          <a href="mailto:developer@creditunion.com" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
            Contact Developer
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
