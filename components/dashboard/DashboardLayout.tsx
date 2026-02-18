import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { supabaseAuth } from '../../services/supabase';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 DashboardLayout: Usuário não autenticado, redirecionando para login');
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600 font-medium">Carregando dashboard...</p>
      </div>
    );
  }

  // Se não está autenticado e não está carregando, não renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} userRole={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userName={user.name} userRole={user.role} />
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
