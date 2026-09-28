import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#DFFF00]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#DFFF00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm tracking-wider font-semibold">VERIFYING ADMIN PRIVILEGES...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
