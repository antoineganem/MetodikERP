import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/Auth/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/authentication/login" replace />;
  }

  return children;
};

export default ProtectedRoute;