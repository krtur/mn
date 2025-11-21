import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabaseAuth } from '../../services/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const navigate = useNavigate();
  const { login, emailPendingConfirmation, resendConfirmationEmail, user } = useAuth();
  const hasRedirected = useRef(false);

  // Redirecionar para dashboard se já estiver logado
  useEffect(() => {
    // Evitar verificar múltiplas vezes
    if (hasRedirected.current) return;
    
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Login: Verificando status de autenticação');
        
        // Verificar se há uma sessão ativa no Supabase
        const { data } = await supabaseAuth.getSession();
        
        if (data?.session) {
          console.log('✅ Login: Sessão válida encontrada');
          
          // Se o usuário já estiver carregado
          if (user) {
            console.log('✅ Login: Usuário já autenticado, redirecionando para dashboard');
            hasRedirected.current = true;
            setIsLoading(false);
            navigate('/dashboard', { replace: true });
          } else {
            // Se há sessão mas não há usuário, aguardar o carregamento do usuário
            console.log('⏳ Login: Sessão válida, aguardando carregamento do usuário');
          }
        } else {
          // Se não houver sessão, limpar tokens
          console.log('❌ Login: Nenhuma sessão válida encontrada');
          localStorage.removeItem('token');
          localStorage.removeItem('supabase-auth');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Login: Erro ao verificar sessão:', error);
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('📝 Iniciando submit do formulário de login');

    try {
      console.log('🔐 Chamando função login()');
      await login(email, password);
      console.log('✅ login() retornou com sucesso');
      // NÃO navegar aqui - deixar o useEffect fazer o redirecionamento
      // quando o user for carregado pelo onAuthStateChange
      
      // Não vamos mais usar timeout aqui, pois está causando problemas
      // O estado isLoading será gerenciado pelo AuthContext
    } catch (err: any) {
      console.log('❌ Erro no login:', err?.message);
      const errorMessage = err?.message || 'Email ou senha inválidos';
      setError(errorMessage);
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleResendEmail = async () => {
    if (!emailPendingConfirmation) return;
    
    setIsResendingEmail(true);
    try {
      await resendConfirmationEmail(emailPendingConfirmation);
      setError('');
      alert('Email de confirmação reenviado! Verifique sua caixa de entrada.');
    } catch (err) {
      setError('Erro ao reenviar email. Tente novamente.');
      console.error(err);
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">M&N Terapeutas</h1>
            <p className="text-slate-600">Portal do Usuário</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              {emailPendingConfirmation && (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-semibold underline disabled:opacity-50"
                >
                  {isResendingEmail ? 'Reenviando...' : 'Reenviar email de confirmação'}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email ou CPF
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com ou 123.456.789-00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Não tem conta?{' '}
              <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                Cadastre-se
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link
              to="/"
              className="block text-center text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
