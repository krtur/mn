import React, { useState, useEffect } from 'react';
import { usePatientManagement, PatientFormData, PatientInvite } from '../../hooks/usePatientManagement';
import { useAuth } from '../auth/AuthContext';

export const PatientRegistration: React.FC = () => {
  const { user } = useAuth();
  const { createPatient, sendInvite, listInvites, cancelInvite, loading, error, success } = usePatientManagement();
  const [activeTab, setActiveTab] = useState<'register' | 'invite'>('register');
  const [invites, setInvites] = useState<PatientInvite[]>([]);
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
  });
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingInvites, setLoadingInvites] = useState(false);

  // Carregar convites ao montar o componente
  useEffect(() => {
    fetchInvites();
  }, []);

  // Função para buscar convites
  const fetchInvites = async () => {
    setLoadingInvites(true);
    const invitesList = await listInvites();
    setInvites(invitesList);
    setLoadingInvites(false);
  };

  // Função para lidar com mudanças no formulário de cadastro
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com mudanças no formulário de convite
  const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para cadastrar paciente
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createPatient(formData);
    if (result) {
      setFormData({
        name: '',
        email: '',
        cpf: '',
        phone: '',
        password: '',
      });
    }
  };

  // Função para enviar convite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await sendInvite(inviteData);
    if (result) {
      setInviteData({
        name: '',
        email: '',
      });
      fetchInvites();
    }
  };

  // Função para cancelar convite
  const handleCancelInvite = async (inviteId: string) => {
    const confirmed = window.confirm('Tem certeza que deseja cancelar este convite?');
    if (confirmed) {
      const success = await cancelInvite(inviteId);
      if (success) {
        fetchInvites();
      }
    }
  };

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status do convite em português
  const getInviteStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceito';
      case 'expired':
        return 'Expirado';
      default:
        return status;
    }
  };

  // Verificar se o convite está expirado
  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Cadastro de Pacientes</h1>
        <p className="text-slate-600 mt-1">
          Cadastre novos pacientes ou envie convites para cadastro
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('register')}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'register'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Cadastro Direto
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'invite'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Enviar Convite
          </button>
        </nav>
      </div>

      {/* Mensagens de erro e sucesso */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Cadastro Direto */}
      {activeTab === 'register' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Cadastrar Novo Paciente</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-slate-700">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Telefone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                A senha deve ter pelo menos 8 caracteres
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Paciente'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulário de Envio de Convite */}
      {activeTab === 'invite' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Enviar Convite por Email</h2>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label htmlFor="invite-name" className="block text-sm font-medium text-slate-700">
                  Nome do Paciente
                </label>
                <input
                  type="text"
                  id="invite-name"
                  name="name"
                  value={inviteData.name}
                  onChange={handleInviteChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label htmlFor="invite-email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="invite-email"
                  name="email"
                  value={inviteData.email}
                  onChange={handleInviteChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400"
                >
                  {loading ? 'Enviando...' : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Convites */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-slate-900">Convites Enviados</h2>
              <button
                onClick={fetchInvites}
                disabled={loadingInvites}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                {loadingInvites ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>

            {loadingInvites ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : invites.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Data de Envio
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Expira em
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {invites.map((invite) => (
                      <tr key={invite.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {invite.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {invite.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invite.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : invite.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {getInviteStatus(invite.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {formatDate(invite.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <span
                            className={
                              isExpired(invite.expires_at) ? 'text-red-500 font-medium' : ''
                            }
                          >
                            {formatDate(invite.expires_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {invite.status === 'pending' && (
                            <button
                              onClick={() => invite.id && handleCancelInvite(invite.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500">
                Nenhum convite enviado ainda.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
