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
import AuditLogs from './pages/AuditLogs';
import Media from './pages/Media';
import { Loader2 } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import axios from 'axios';

// Prevent indefinite loading by setting a global timeout for the admin panel
axios.defaults.timeout = 30000; // 30 seconds timeout

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen fullScreen message="Loading Admin Dashboard..." />;
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
        <Route path="media" element={<Media />} />
        <Route path="users" element={<Users />} />
        <Route path="sms" element={<Sms />} />
        <Route path="audit-logs" element={<AuditLogs />} />
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
