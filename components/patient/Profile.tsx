import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabaseAPI } from '../../services/supabase-api';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    emergencyContact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!user) throw new Error('Usuário não autenticado');

      await supabaseAPI.user.updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
      });

      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar perfil. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-600">{user?.email}</p>
            <p className="text-sm text-slate-500 mt-1">Paciente</p>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-semibold text-slate-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Telefone</p>
                <p className="font-semibold text-slate-900">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Membro desde</p>
                <p className="font-semibold text-slate-900">
                  {user?.createdAt && new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Editar Perfil
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Seu endereço"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contato de Emergência</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Telefone de emergência"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Segurança</h2>
        <button className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors">
          Alterar Senha
        </button>
      </div>

      <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
        <h2 className="text-xl font-bold text-red-900 mb-4">Zona de Perigo</h2>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Desativar Conta
        </button>
      </div>
    </div>
  );
};
