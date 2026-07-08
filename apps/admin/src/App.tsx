import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Memberships from './pages/Memberships';
import Loans from './pages/Loans';
import Welfare from './pages/Welfare';
import Messages from './pages/Messages';
import CMS from './pages/CMS';
import Users from './pages/Users';
import Sms from './pages/Sms';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)' }}>
        <Loader2 className="spinner" size={48} color="var(--primary-color)" />
      </div>
    );
  }
  
  if (!admin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="memberships" element={<Memberships />} />
        <Route path="loans" element={<Loans />} />
        <Route path="welfare" element={<Welfare />} />
        <Route path="messages" element={<Messages />} />
        <Route path="cms" element={<CMS />} />
        <Route path="users" element={<Users />} />
        <Route path="sms" element={<Sms />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
