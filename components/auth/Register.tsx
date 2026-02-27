import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';
import { useTherapists } from '../../hooks/useTherapists';
import { supabase } from '../../services/supabase';
import { maskPhone } from '../utils/masks';
import { ParticleNetwork } from '../ParticleNetwork';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    therapistId: '', // ID do terapeuta selecionado
    role: 'patient' as UserRole,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user } = useAuth();
  const { therapists, loading: therapistsLoading } = useTherapists();
  const hasRedirected = useRef(false);

  // Redirecionar para dashboard se já estiver logado
  useEffect(() => {
    if (user && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Verificar se há um convite na URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('invite');

    if (inviteId) {
      loadInviteData(inviteId);
    }
  }, [location]);

  // Função para carregar dados do convite
  const loadInviteData = async (inviteId: string) => {
    setLoadingInvite(true);
    setError('');

    try {
      const { data: invite, error: inviteError } = await supabase
        .from('patient_invites')
        .select('*')
        .eq('id', inviteId)
        .eq('status', 'pending')
        .single();

      if (inviteError || !invite) {
        setError('Convite inválido ou expirado');
        return;
      }

      // Verificar se o convite está expirado
      const expiresAt = new Date(invite.expires_at);
      if (expiresAt < new Date()) {
        setError('Este convite expirou');
        return;
      }

      setInviteData(invite);

      // Preencher formulário com dados do convite
      setFormData(prev => ({
        ...prev,
        name: invite.name,
        email: invite.email,
        therapistId: invite.therapist_id
      }));

    } catch (err) {
      console.error('Erro ao carregar convite:', err);
      setError('Erro ao carregar convite');
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: maskPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.therapistId) {
      setError('Selecione um terapeuta');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    setIsLoading(true);

    try {
      // Buscar o terapeuta selecionado (se não for de um convite)
      let selectedTherapist;
      if (!inviteData) {
        selectedTherapist = therapists.find((t) => t.id === formData.therapistId);
        if (!selectedTherapist) {
          setError('Terapeuta inválido');
          setIsLoading(false);
          return;
        }
      }

      // Registrar o usuário com therapist_id (limpando máscaras)
      const registerData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        role: formData.role,
        password: formData.password,
        therapistId: formData.therapistId, // Passar o ID do terapeuta
      };

      await register(registerData);

      // Se for um convite, atualizar o status para 'accepted'
      if (inviteData?.id) {
        await supabase
          .from('patient_invites')
          .update({ status: 'accepted' })
          .eq('id', inviteData.id);
      }

      // Mensagem personalizada baseada em se é convite ou não
      const successMessage = inviteData
        ? `Cadastro realizado com sucesso! Você aceitou o convite do terapeuta. Faça login para continuar.`
        : `Cadastro realizado com sucesso! Você está associado ao terapeuta ${selectedTherapist?.name}. Faça login para continuar.`;

      navigate('/login', {
        state: {
          message: successMessage,
        },
      });
    } catch (err: any) {
      console.error('❌ Erro durante o registro:', err);

      // Tenta extrair a mensagem de erro mais útil
      const errorMessage = err?.message || err?.details || 'Erro desconhecido';

      if (errorMessage.includes('already registered') || errorMessage.includes('registered')) {
        setError('Este email já está cadastrado. Tente fazer login ou recuperar sua senha.');
      } else if (errorMessage.includes('null value in column "cpf"')) {
        setError('Erro interno do servidor: A coluna CPF no banco de dados ainda é obrigatória. Por favor, contate o administrador.');
      } else if (errorMessage.includes('rate limit')) {
        setError('Muitas tentativas. Por favor, aguarde um pouco antes de tentar novamente.');
      } else {
        setError(`Erro ao registrar: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
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
            </div>
          )}

          {/* Mensagem de convite */}
          {inviteData && (
            <div className="relative z-10 mb-6 p-4 bg-green-900/30 border border-green-500/30 rounded-xl backdrop-blur-sm">
              <p className="text-green-400 text-sm font-medium">
                Você foi convidado(a) pelo terapeuta para se cadastrar. Complete seu cadastro abaixo.
              </p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4 max-h-96 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#8b5cf6_transparent]">
            {/* Seleção de terapeuta - mostrar apenas se não for convite */}
            {!inviteData && (
              <div>
                <label htmlFor="therapistId" className="block text-sm font-semibold text-slate-300 mb-2">
                  Selecione seu Terapeuta
                </label>
                {therapistsLoading ? (
                  <div className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-slate-400 text-sm">
                    Carregando terapeutas...
                  </div>
                ) : (
                  <select
                    id="therapistId"
                    name="therapistId"
                    value={formData.therapistId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#0f0f13] text-white transition-all appearance-none"
                    required
                  >
                    <option value="" className="bg-[#0f0f13] text-slate-300">-- Escolha um terapeuta --</option>
                    {therapists.map((therapist) => (
                      <option key={therapist.id} value={therapist.id} className="bg-[#0f0f13] text-white">
                        {therapist.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className={`w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${inviteData ? 'bg-white/10 text-slate-300' : 'bg-white/5 text-white'} transition-all placeholder:text-slate-500`}
                required
                readOnly={!!inviteData}
              />
              {inviteData && (
                <p className="mt-1 text-xs text-slate-400">Nome preenchido automaticamente do convite</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={`w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${inviteData ? 'bg-white/10 text-slate-300' : 'bg-white/5 text-white'} transition-all placeholder:text-slate-500`}
                required
                readOnly={!!inviteData}
              />
              {inviteData && (
                <p className="mt-1 text-xs text-slate-400">Email preenchido automaticamente do convite</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-300 mb-2">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300 mb-2">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  Criando conta...
                </span>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Link Login */}
          <div className="relative z-10 mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                Faça login
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
