import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F1E6] space-y-4">
        <div className="w-10 h-10 border-4 border-[#C26D53] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Verifying credentials...</span>
      </div>
    );
  }

  // Redirect if not logged in or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
