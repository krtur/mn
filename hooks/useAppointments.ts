import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface Appointment {
  id: string;
  patient_id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: { name: string; email: string };
  therapist?: { name: string; email: string };
}

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('appointments')
          .select('*');

        // Se for paciente, buscar agendamentos do paciente
        if (user.role === 'patient') {
          query = query.eq('patient_id', user.id);
        }
        // Se for terapeuta, buscar agendamentos do terapeuta
        else if (user.role.startsWith('therapist')) {
          query = query.eq('therapist_id', user.id);
        }

        // Ordenar por data e limitar
        query = query.order('start_time', { ascending: true }).limit(100);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Erro ao buscar agendamentos:', fetchError);
          if (isMounted) setError(fetchError.message);
          return;
        }

        if (isMounted) {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao buscar agendamentos');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`appointments_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: user.role === 'patient' 
            ? `patient_id=eq.${user.id}` 
            : `therapist_id=eq.${user.id}`
        },
        () => {
          if (isMounted) {
            fetchAppointments();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user, refetchTrigger]);

  const updateAppointment = async (
    appointmentId: string,
    updates: {
      start_time?: string;
      end_time?: string;
      status?: string;
      notes?: string;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      throw err;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Erro ao deletar agendamento:', err);
      throw err;
    }
  };

  const refetch = () => {
    console.log('🔄 Refetch manual de agendamentos');
    setRefetchTrigger(prev => prev + 1);
  };

  return { appointments, loading, error, updateAppointment, deleteAppointment, refetch };
};
