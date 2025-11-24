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

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('appointments')
          .select(`
            *,
            patient:patient_id(name, email),
            therapist:therapist_id(name, email)
          `);

        // Se for paciente, buscar agendamentos do paciente
        if (user.role === 'patient') {
          query = query.eq('patient_id', user.id);
        }
        // Se for terapeuta, buscar agendamentos do terapeuta
        else if (user.role.startsWith('therapist')) {
          query = query.eq('therapist_id', user.id);
        }

        // Ordenar por data
        query = query.order('start_time', { ascending: true });

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Erro ao buscar agendamentos:', fetchError);
          setError(fetchError.message);
          return;
        }

        console.log('Agendamentos carregados:', {
          userRole: user.role,
          userId: user.id,
          count: data?.length || 0,
          data
        });

        setAppointments(data || []);
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('appointments')
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
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

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

  return { appointments, loading, error, updateAppointment, deleteAppointment };
};
