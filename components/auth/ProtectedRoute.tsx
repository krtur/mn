import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';
import { supabaseAuth } from '../../services/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);
  
  // Verificar token no localStorage
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('token');
        const supabaseAuthData = localStorage.getItem('supabase-auth');
        
        if (token && supabaseAuthData) {
          // Verificar se a sessão é válida
          const { data } = await supabaseAuth.getSession();
          if (data?.session) {
            console.log('✅ ProtectedRoute: Sessão válida encontrada');
            setHasValidToken(true);
          } else {
            console.log('❌ ProtectedRoute: Sessão inválida');
            setHasValidToken(false);
            // Limpar tokens inválidos
            localStorage.removeItem('token');
            localStorage.removeItem('supabase-auth');
          }
        } else {
          console.log('❌ ProtectedRoute: Nenhum token encontrado');
          setHasValidToken(false);
        }
      } catch (error) {
        console.error('❌ ProtectedRoute: Erro ao verificar token:', error);
        setHasValidToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };
    
    checkToken();
  }, []);
  
  // Mostrar loading enquanto verifica token
  if (isLoading || isCheckingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Verificar autenticação
  if ((!isAuthenticated && !hasValidToken) || (!user && !hasValidToken)) {
    console.log('🚫 ProtectedRoute: Redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Verificar permissões
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
