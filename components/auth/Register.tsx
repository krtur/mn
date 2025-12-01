import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';
import { useTherapists } from '../../hooks/useTherapists';
import { supabase } from '../../services/supabase';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.therapistId) {
      setError('Selecione um terapeuta');
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

      // Registrar o usuário com therapist_id
      const registerData: any = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone,
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
    } catch (err) {
      setError('Erro ao registrar. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
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
            </div>
          )}

          {/* Mensagem de convite */}
          {inviteData && (
            <div className="mb-6 p-4 bg-green-50/80 border border-green-200 rounded-xl backdrop-blur-sm">
              <p className="text-green-700 text-sm font-medium">
                Você foi convidado(a) pelo terapeuta para se cadastrar. Complete seu cadastro abaixo.
              </p>
            </div>
          )}
          
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {/* Seleção de terapeuta - mostrar apenas se não for convite */}
            {!inviteData && (
              <div>
                <label htmlFor="therapistId" className="block text-sm font-semibold text-slate-700 mb-2">
                  Selecione seu Terapeuta
                </label>
                {therapistsLoading ? (
                  <div className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-600 text-sm">
                    Carregando terapeutas...
                  </div>
                ) : (
                  <select
                    id="therapistId"
                    name="therapistId"
                    value={formData.therapistId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
                    required
                  >
                    <option value="">-- Escolha um terapeuta --</option>
                    {therapists.map((therapist) => (
                      <option key={therapist.id} value={therapist.id}>
                        {therapist.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inviteData ? 'bg-slate-100' : 'bg-slate-50/50'} transition-all placeholder:text-slate-400`}
                required
                readOnly={!!inviteData}
              />
              {inviteData && (
                <p className="mt-1 text-xs text-slate-500">Nome preenchido automaticamente do convite</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inviteData ? 'bg-slate-100' : 'bg-slate-50/50'} transition-all placeholder:text-slate-400`}
                required
                readOnly={!!inviteData}
              />
              {inviteData && (
                <p className="mt-1 text-xs text-slate-500">Email preenchido automaticamente do convite</p>
              )}
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-semibold text-slate-700 mb-2">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="123.456.789-00"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100 mt-6"
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
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Faça login
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
