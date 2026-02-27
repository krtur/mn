import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ParticleNetwork } from '../ParticleNetwork';

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
    <div className="min-h-screen flex items-center justify-center bg-[#020205] relative px-4 py-8 overflow-hidden font-sans">
      {/* Global Background with Particles */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <ParticleNetwork particleColor="rgba(124, 58, 237, 1)" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card com efeito glass */}
        <div className="bg-[#0a0a0f] backdrop-blur-md rounded-[2rem] shadow-2xl p-8 border border-white/10 animate-fade-in group">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-purple-900/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-blue-900/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000 pointer-events-none"></div>

          {/* Logo */}
          <div className="relative z-10 text-center mb-10">
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="M&N Terapeutas"
                  className="h-20 w-auto drop-shadow-lg hover:scale-105 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="relative z-10 mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl backdrop-blur-sm animate-shake">
              <p className="text-red-400 text-sm font-medium">{error}</p>
              {emailPendingConfirmation && (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                  className="mt-3 text-sm text-red-300 hover:text-red-200 font-semibold underline disabled:opacity-50 transition-colors"
                >
                  {isResendingEmail ? 'Reenviando...' : 'Reenviar email de confirmação'}
                </button>
              )}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder:text-slate-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-900/50 disabled:shadow-none transform hover:-translate-y-1 disabled:hover:translate-y-0 mt-6"
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
          <div className="relative z-10 mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Não tem conta?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
            <Link
              to="/"
              className="block text-center text-slate-500 hover:text-purple-400 text-sm font-semibold transition-colors"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
