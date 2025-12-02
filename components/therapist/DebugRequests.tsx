import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

export const DebugRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        setLoading(true);
        
        // Buscar todas as solicitações sem filtro
        const { data, error: fetchError } = await supabase
          .from('new_client_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Erro ao buscar solicitações:', fetchError);
          setError(`Erro ao buscar solicitações: ${fetchError.message}`);
          return;
        }

        console.log('Todas as solicitações:', data);
        setRequests(data || []);
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError(`Erro inesperado: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, []);

  // Função para testar a criação de uma solicitação
  const createTestRequest = async () => {
    try {
      setLoading(true);
      
      const testData = {
        name: `Teste ${new Date().toLocaleTimeString()}`,
        email: 'teste@exemplo.com',
        phone: '(11) 99999-9999',
        therapist_id: '83273ffc-c878-4abc-a24b-e35fd4801339', // ID da Nadielma
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('new_client_requests')
        .insert([testData])
        .select();
        
      if (error) {
        console.error('Erro ao criar solicitação de teste:', error);
        setError(`Erro ao criar solicitação de teste: ${error.message}`);
        return;
      }
      
      console.log('Solicitação de teste criada:', data);
      
      // Atualizar a lista
      const { data: updatedData, error: fetchError } = await supabase
        .from('new_client_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        console.error('Erro ao atualizar lista:', fetchError);
        return;
      }
      
      setRequests(updatedData || []);
    } catch (err) {
      console.error('Erro inesperado ao criar solicitação:', err);
      setError(`Erro inesperado ao criar solicitação: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Debug - Todas as Solicitações</h1>
        <div className="flex gap-2">
          <button
            onClick={createTestRequest}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Criar Solicitação de Teste
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Atualizar Página
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="ml-2 text-slate-600">Carregando...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium">Erro</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h2 className="font-medium text-slate-700">Todas as Solicitações ({requests.length})</h2>
        </div>
        
        {requests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">Nenhuma solicitação encontrada no banco de dados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Telefone</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Terapeuta ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-500">{request.id.substring(0, 8)}...</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{request.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{request.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{request.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{request.therapist_id ? request.therapist_id.substring(0, 8) + '...' : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(request.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
