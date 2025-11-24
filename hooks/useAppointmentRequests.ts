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

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('appointment_requests')
          .select(`
            *,
            patient:patient_id(name, email),
            therapist:therapist_id(name, email)
          `);

        // Se for paciente, buscar solicitações do paciente
        if (user.role === 'patient') {
          query = query.eq('patient_id', user.id);
        }
        // Se for terapeuta, buscar solicitações para o terapeuta
        else if (user.role.startsWith('therapist')) {
          query = query.eq('therapist_id', user.id);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Erro ao buscar solicitações:', fetchError);
          setError(fetchError.message);
          return;
        }

        setRequests(data || []);
      } catch (err) {
        console.error('Erro ao buscar solicitações:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar solicitações');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('appointment_requests')
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
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

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
      const startTime = `${requestData.requested_date}T${requestData.requested_time}:00`;
      const [hours, minutes] = requestData.requested_time.split(':');
      const endDate = new Date(requestData.requested_date);
      endDate.setHours(parseInt(hours) + 1, parseInt(minutes));
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
      const { data, error: updateError } = await supabase
        .from('appointment_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      return data?.[0];
    } catch (err) {
      console.error('Erro ao aprovar solicitação:', err);
      throw err;
    }
  };

  const rejectRequest = async (id: string) => {
    if (!user || !user.role.startsWith('therapist')) return;

    try {
      const { data, error: updateError } = await supabase
        .from('appointment_requests')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

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

  return {
    requests,
    loading,
    error,
    createRequest,
    approveRequest,
    rejectRequest,
    cancelRequest
  };
};
