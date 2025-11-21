import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabaseAPI } from '../../services/supabase-api';

export const DocumentGeneration: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientName: '',
    documentType: 'report' as 'report' | 'diagnosis' | 'progress_note',
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

      // TODO: Buscar ID do paciente pelo nome
      // Por enquanto, usar um ID de exemplo
      const patientId = 'patient-id-placeholder';

      await supabaseAPI.document.create({
        patientId,
        type: formData.documentType,
        title: formData.title,
        content: formData.content,
      });

      setSuccess('Documento criado com sucesso!');
      setFormData({ patientName: '', documentType: 'report', title: '', content: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao criar documento. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Emitir Documento</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Nome do paciente"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Documento</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="report">Relatório de Progresso</option>
                <option value="diagnosis">Diagnóstico</option>
                <option value="progress_note">Notas de Progresso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título do documento"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Escreva o conteúdo do documento..."
                rows={10}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {isLoading ? 'Gerando...' : 'Gerar Documento'}
              </button>
              <button
                type="button"
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
              >
                Salvar como Rascunho
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Templates</h2>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <p className="font-semibold text-slate-900">Relatório Padrão</p>
              <p className="text-xs text-slate-600">Template básico</p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <p className="font-semibold text-slate-900">Diagnóstico Completo</p>
              <p className="text-xs text-slate-600">Com avaliação detalhada</p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <p className="font-semibold text-slate-900">Notas Rápidas</p>
              <p className="text-xs text-slate-600">Resumo da sessão</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
