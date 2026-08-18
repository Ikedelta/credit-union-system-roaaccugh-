import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import axios from 'axios';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Memberships = lazy(() => import('./pages/Memberships'));
const Loans = lazy(() => import('./pages/Loans'));
const Welfare = lazy(() => import('./pages/Welfare'));
const Messages = lazy(() => import('./pages/Messages'));
const CMS = lazy(() => import('./pages/CMS'));
const Users = lazy(() => import('./pages/Users'));
const Sms = lazy(() => import('./pages/Sms'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));
const Media = lazy(() => import('./pages/Media'));

// Prevent indefinite loading by setting a global timeout for the admin panel
axios.defaults.timeout = 30000; // 30 seconds timeout
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

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
    <Suspense fallback={<LoadingScreen fullScreen message="Loading application..." />}>
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
    </Suspense>
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
