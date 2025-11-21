import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';
import { useTherapists } from '../../hooks/useTherapists';

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
  const navigate = useNavigate();
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
      // Buscar o terapeuta selecionado
      const selectedTherapist = therapists.find((t) => t.id === formData.therapistId);

      if (!selectedTherapist) {
        setError('Terapeuta inválido');
        return;
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

      navigate('/login', {
        state: {
          message: `Cadastro realizado com sucesso! Você está associado ao terapeuta ${selectedTherapist.name}. Faça login para continuar.`,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">M&N Terapeutas</h1>
            <p className="text-slate-600">Criar Conta</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="therapistId" className="block text-sm font-medium text-slate-700 mb-1">
                Selecione seu Terapeuta
              </label>
              {therapistsLoading ? (
                <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600">
                  Carregando terapeutas...
                </div>
              ) : (
                <select
                  id="therapistId"
                  name="therapistId"
                  value={formData.therapistId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-slate-700 mb-1">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="123.456.789-00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                Faça login
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
