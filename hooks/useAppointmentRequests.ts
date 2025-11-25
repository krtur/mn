import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface AppointmentRequest {
  id: string;
  patient_id: string;
  therapist_id: string;
  requested_date: string;
  requested_time: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
  patient?: { name: string; email: string };
  therapist?: { name: string; email: string };
}

export const useAppointmentRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('appointment_requests')
          .select('*, patient:patient_id(id, name, email)');

        // Se for paciente, buscar solicitações do paciente
        if (user.role === 'patient') {
          query = query.eq('patient_id', user.id);
        }
        // Se for terapeuta, buscar solicitações para o terapeuta
        else if (user.role.startsWith('therapist')) {
          query = query.eq('therapist_id', user.id);
        }

        // Filtrar apenas solicitações pendentes
        query = query.eq('status', 'pending');
        query = query.order('created_at', { ascending: false }).limit(50);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Erro ao buscar solicitações:', fetchError);
          if (isMounted) setError(fetchError.message);
          return;
        }

        console.log('📋 Solicitações pendentes carregadas:', data?.length || 0, data);
        if (isMounted) {
          setRequests(data || []);
        }
      } catch (err) {
        console.error('Erro ao buscar solicitações:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao buscar solicitações');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    // Subscribe to real-time updates (sem joins para melhor performance)
    const subscription = supabase
      .channel(`appointment_requests_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointment_requests',
          filter: user.role === 'patient' 
            ? `patient_id=eq.${user.id}` 
            : `therapist_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📢 Mudança em appointment_requests:', payload);
          if (isMounted) {
            // Pequeno delay para garantir que o banco foi atualizado
            setTimeout(() => {
              if (isMounted) {
                fetchRequests();
              }
            }, 500);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user, refetchTrigger]);

  const createRequest = async (
    therapistId: string,
    requestedDate: string,
    requestedTime: string,
    reason?: string
  ) => {
    if (!user || user.role !== 'patient') return;

    try {
      const { data, error: insertError } = await supabase
        .from('appointment_requests')
        .insert([
          {
            patient_id: user.id,
            therapist_id: therapistId,
            requested_date: requestedDate,
            requested_time: requestedTime,
            reason: reason,
            status: 'pending'
          }
        ])
        .select();

      if (insertError) {
        throw insertError;
      }

      // Atualizar lista imediatamente com a nova solicitação
      if (data && data.length > 0) {
        const newRequest = data[0];
        console.log('✅ Adicionando nova solicitação à lista:', newRequest);
        setRequests(prev => [newRequest, ...prev]);
      }

      return data?.[0];
    } catch (err) {
      console.error('Erro ao criar solicitação:', err);
      throw err;
    }
  };

  const approveRequest = async (id: string) => {
    if (!user || !user.role.startsWith('therapist')) return;

    try {
      // Buscar a solicitação
      const { data: requestData, error: fetchError } = await supabase
        .from('appointment_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Criar agendamento confirmado
      const [hours, minutes] = requestData.requested_time.split(':');
      
      // Criar data de início usando UTC para evitar problemas de fuso horário
      const [year, month, day] = requestData.requested_date.split('-');
      const startDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), 0));
      const startTime = startDate.toISOString();
      
      // Criar data de fim (1 hora depois)
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
      const endTime = endDate.toISOString();

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: requestData.patient_id,
            therapist_id: requestData.therapist_id,
            start_time: startTime,
            end_time: endTime,
            status: 'confirmed',
            created_by: user.id
          }
        ]);

      if (appointmentError) throw appointmentError;

      // Atualizar status da solicitação
      console.log('✅ Atualizando status da solicitação para approved:', id);
      const { data, error: updateError } = await supabase
        .from('appointment_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) {
        console.error('❌ Erro ao atualizar status:', updateError);
        throw updateError;
      }

      console.log('✅ Status atualizado com sucesso:', data);
      return data?.[0];
    } catch (err) {
      console.error('Erro ao aprovar solicitação:', err);
      throw err;
    }
  };

  const rejectRequest = async (id: string) => {
    if (!user || !user.role.startsWith('therapist')) return;

    try {
      console.log('❌ Rejeitando solicitação:', id);
      const { data, error: updateError } = await supabase
        .from('appointment_requests')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) {
        console.error('❌ Erro ao rejeitar:', updateError);
        throw updateError;
      }

      console.log('✅ Solicitação rejeitada com sucesso:', data);
      return data?.[0];
    } catch (err) {
      console.error('Erro ao rejeitar solicitação:', err);
      throw err;
    }
  };

  const cancelRequest = async (id: string) => {
    if (!user || user.role !== 'patient') return;

    try {
      const { data, error: updateError } = await supabase
        .from('appointment_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      return data?.[0];
    } catch (err) {
      console.error('Erro ao cancelar solicitação:', err);
      throw err;
    }
  };

  const refetch = () => {
    console.log('🔄 Refetch manual de solicitações');
    setRefetchTrigger(prev => prev + 1);
  };

  return {
    requests,
    loading,
    error,
    createRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    refetch
  };
};
