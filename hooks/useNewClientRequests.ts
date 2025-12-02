import { useState, useEffect } from 'react';
import { supabase, NewClientRequest } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

// Cliente Supabase para solicitações anônimas
const anonSupabase = supabase;

interface UseNewClientRequestsReturn {
  requests: NewClientRequest[];
  isLoading: boolean;
  error: string | null;
  createRequest: (data: Omit<NewClientRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  updateRequestStatus: (id: string, status: NewClientRequest['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  refreshRequests: () => Promise<void>;
}

export const useNewClientRequests = (): UseNewClientRequestsReturn => {
  const [requests, setRequests] = useState<NewClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar se o usuário é terapeuta
      if (!user || (user.role !== 'therapist_a' && user.role !== 'therapist_b')) {
        console.log('Usuário não é terapeuta:', user?.role);
        setRequests([]);
        return;
      }

      console.log('Buscando solicitações para o terapeuta:', user.id, user.name, user.role);
      
      // Buscar todas as solicitações (temporariamente removendo o filtro por terapeuta para debug)
      const { data, error: fetchError } = await supabase
        .from('new_client_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar solicitações:', fetchError);
        throw fetchError;
      }

      console.log('Solicitações encontradas:', data?.length || 0, data);
      setRequests(data || []);
    } catch (err) {
      console.error('Erro ao buscar solicitações de novos clientes:', err);
      setError('Não foi possível carregar as solicitações. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Criar nova solicitação (pode ser chamado sem autenticação)
  const createRequest = async (data: Omit<NewClientRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      console.log('Criando nova solicitação:', data);
      
      const requestData = {
        ...data,
        status: 'pending'
      };
      
      console.log('Dados a serem inseridos:', requestData);
      
      // Modificar a política de inserção para permitir solicitações anônimas
      const { data: insertedData, error: insertError } = await anonSupabase
        .from('new_client_requests')
        .insert([requestData])
        .select();

      if (insertError) {
        console.error('Erro ao inserir solicitação:', insertError);
        console.error('Código de erro:', insertError.code);
        console.error('Mensagem de erro:', insertError.message);
        console.error('Detalhes:', insertError.details);
        throw insertError;
      }
      
      console.log('Solicitação criada com sucesso:', insertedData);
      
      // Atualizar a lista local se o usuário for terapeuta
      if (user && (user.role === 'therapist_a' || user.role === 'therapist_b')) {
        fetchRequests();
      }

      return { success: true };
    } catch (err) {
      console.error('Erro ao criar solicitação:', err);
      return { success: false, error: 'Não foi possível enviar sua solicitação. Tente novamente mais tarde.' };
    }
  };

  // Atualizar status da solicitação (apenas terapeutas)
  const updateRequestStatus = async (id: string, status: NewClientRequest['status'], notes?: string) => {
    try {
      if (!user || (user.role !== 'therapist_a' && user.role !== 'therapist_b')) {
        return { success: false, error: 'Permissão negada.' };
      }

      const updateData: Partial<NewClientRequest> = { status };
      if (notes) {
        updateData.notes = notes;
      }

      const { error: updateError } = await supabase
        .from('new_client_requests')
        .update(updateData)
        .eq('id', id)
        .eq('therapist_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Atualizar a lista local
      setRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status, ...(notes ? { notes } : {}) } : req
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar solicitação:', err);
      return { success: false, error: 'Não foi possível atualizar a solicitação. Tente novamente mais tarde.' };
    }
  };

  // Carregar solicitações ao iniciar
  useEffect(() => {
    if (user && (user.role === 'therapist_a' || user.role === 'therapist_b')) {
      fetchRequests();
    }
  }, [user]);

  // Configurar listener para atualizações em tempo real
  useEffect(() => {
    if (!user || (user.role !== 'therapist_a' && user.role !== 'therapist_b')) {
      return;
    }

    const subscription = supabase
      .channel('new_client_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'new_client_requests',
          filter: `therapist_id=eq.${user.id}`
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    requests,
    isLoading,
    error,
    createRequest,
    updateRequestStatus,
    refreshRequests: fetchRequests
  };
};
