import React, { useState } from 'react';
import { useNewClientRequests } from '../../hooks/useNewClientRequests';
import { NewClientRequest } from '../../services/supabase';

export const NewClientRequests: React.FC = () => {
  const { requests, isLoading, error, updateRequestStatus, refreshRequests } = useNewClientRequests();
  const [selectedRequest, setSelectedRequest] = useState<NewClientRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Formatar data
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Selecionar solicitação para visualizar detalhes
  const handleSelectRequest = (request: NewClientRequest) => {
    setSelectedRequest(request);
    setNotes(request.notes || '');
  };

  // Atualizar status da solicitação
  const handleUpdateStatus = async (status: NewClientRequest['status']) => {
    if (!selectedRequest) return;
    
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const result = await updateRequestStatus(selectedRequest.id, status, notes);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao atualizar status');
      }
      
      // Atualizar solicitação selecionada
      if (selectedRequest) {
        setSelectedRequest({
          ...selectedRequest,
          status,
          notes
        });
      }
      
      // Atualizar lista
      await refreshRequests();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setUpdateError('Não foi possível atualizar o status. Tente novamente mais tarde.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Obter cor do status
  const getStatusColor = (status: NewClientRequest['status']): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Obter texto do status
  const getStatusText = (status: NewClientRequest['status']): string => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'contacted':
        return 'Contatado';
      case 'scheduled':
        return 'Agendado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="ml-2 text-slate-600">Carregando solicitações...</p>
      </div>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-medium">Erro ao carregar solicitações</p>
        <p>{error}</p>
        <button
          onClick={refreshRequests}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Novos Clientes</h1>
        <button
          onClick={refreshRequests}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600">Nenhuma solicitação de novo cliente encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de solicitações */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h2 className="font-medium text-slate-700">Solicitações ({requests.length})</h2>
              </div>
              <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                {requests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => handleSelectRequest(request)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-slate-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{request.name}</p>
                        <p className="text-sm text-slate-600">{request.email}</p>
                        <p className="text-sm text-slate-600">{request.phone}</p>
                      </div>
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(request.created_at)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detalhes da solicitação */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-lg shadow">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium text-slate-900">Detalhes da Solicitação</h2>
                    <span className={`inline-block px-3 py-1 text-xs rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusText(selectedRequest.status)}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Informações do cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Nome</h3>
                      <p className="text-slate-900">{selectedRequest.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Data da Solicitação</h3>
                      <p className="text-slate-900">{formatDate(selectedRequest.created_at)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">E-mail</h3>
                      <p className="text-slate-900">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Telefone</h3>
                      <p className="text-slate-900">{selectedRequest.phone}</p>
                    </div>
                  </div>

                  {/* Anotações */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Anotações</h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-32"
                      placeholder="Adicione anotações sobre este cliente..."
                      disabled={isUpdating}
                    ></textarea>
                  </div>

                  {/* Erro de atualização */}
                  {updateError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {updateError}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex flex-wrap gap-3">
                    {selectedRequest.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus('contacted')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          )}
                          Marcar como Contatado
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('cancelled')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          disabled={isUpdating}
                        >
                          Cancelar Solicitação
                        </button>
                      </>
                    )}

                    {selectedRequest.status === 'contacted' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus('scheduled')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                          Marcar como Agendado
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('cancelled')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          disabled={isUpdating}
                        >
                          Cancelar Solicitação
                        </button>
                      </>
                    )}

                    {(selectedRequest.status === 'scheduled' || selectedRequest.status === 'cancelled') && (
                      <button
                        onClick={() => handleUpdateStatus('pending')}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        disabled={isUpdating}
                      >
                        Retornar para Pendente
                      </button>
                    )}

                    {/* Salvar anotações */}
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.status)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Salvando...' : 'Salvar Anotações'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center h-full flex items-center justify-center">
                <div>
                  <p className="text-slate-600 mb-2">Selecione uma solicitação para ver os detalhes</p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
