import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

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
        
        // Verificar se há um token válido no localStorage (usando API backend)
        const token = localStorage.getItem('token');
        
        if (token && user) {
          console.log('✅ Login: Token válido e usuário carregado, redirecionando para dashboard');
          hasRedirected.current = true;
          setIsLoading(false);
          navigate('/dashboard', { replace: true });
        } else if (token && !user) {
          // Se há token mas não há usuário, aguardar o carregamento do usuário
          console.log('⏳ Login: Token válido, aguardando carregamento do usuário');
        } else {
          // Se não houver token, limpar tokens
          console.log('❌ Login: Nenhum token válido encontrado');
          localStorage.removeItem('token');
          localStorage.removeItem('supabase-auth');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Login: Erro ao verificar autenticação:', error);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card com efeito glass */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img 
                src="/logopreto.png" 
                alt="M&N Terapeutas" 
                className="h-20 w-auto drop-shadow-lg"
              />
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm animate-shake">
              <p className="text-red-700 text-sm font-medium">{error}</p>
              {emailPendingConfirmation && (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-semibold underline disabled:opacity-50 transition-colors"
                >
                  {isResendingEmail ? 'Reenviando...' : 'Reenviar email de confirmação'}
                </button>
              )}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email ou CPF
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com ou 123.456.789-00"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Link Cadastro */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Não tem conta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-slate-200/50">
            <Link
              to="/"
              className="block text-center text-slate-600 hover:text-blue-600 text-sm font-semibold transition-colors"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>

        {/* Decoração */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};
