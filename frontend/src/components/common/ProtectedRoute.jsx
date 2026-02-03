import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ allowedRoles }) => {
  const { session, profile, loading } = useAuth();

  if (loading) return (
    <div className="vh-100 d-flex align-items-center bg-light">
      <LoadingScreen message="Memverifikasi akses..." />
    </div>
  );

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
