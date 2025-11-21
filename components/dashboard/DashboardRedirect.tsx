import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/**
 * Componente que redireciona automaticamente para o dashboard correto
 * baseado no role do usuário (paciente ou terapeuta)
 */
export const DashboardRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Mostrar loading enquanto carrega
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando dashboard...</p>
      </div>
    );
  }

  // Redirecionar para o dashboard correto baseado no role
  if (user.role === 'patient') {
    return <Navigate to="/dashboard/patient" replace />;
  } else if (user.role === 'therapist_a' || user.role === 'therapist_b') {
    return <Navigate to="/dashboard/therapist" replace />;
  }

  // Fallback (não deve chegar aqui)
  return <Navigate to="/login" replace />;
};
