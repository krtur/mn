import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Mostrar loading enquanto carrega autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando...</p>
      </div>
    );
  }

  // Verificar autenticação
  if (!isAuthenticated || !user) {
    console.log('🚫 ProtectedRoute: Redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Verificar permissões
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
