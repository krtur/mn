import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface AppointmentRecurrence {
  id: string;
  therapist_id: string;
  patient_id?: string;
  start_date: string;
  end_date?: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  day_of_week?: number;
  day_of_month?: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAppointmentRecurrences = () => {
  const { user } = useAuth();
  const [recurrences, setRecurrences] = useState<AppointmentRecurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.role.startsWith('therapist')) {
      setLoading(false);
      return;
    }

    const fetchRecurrences = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('appointment_recurrences')
          .select('*')
          .eq('therapist_id', user.id)
          .order('start_date', { ascending: true });

        if (fetchError) {
          console.error('Erro ao buscar recorrências:', fetchError);
          setError(fetchError.message);
          return;
        }

        setRecurrences(data || []);
      } catch (err) {
        console.error('Erro ao buscar recorrências:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar recorrências');
      } finally {
        setLoading(false);
      }
    };

    fetchRecurrences();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('appointment_recurrences')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointment_recurrences',
          filter: `therapist_id=eq.${user.id}`
        },
        () => {
          fetchRecurrences();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const createRecurrence = async (
    patientId: string | null,
    startDate: string,
    endDate: string | null,
    frequency: 'weekly' | 'biweekly' | 'monthly',
    dayOfWeek: number | null,
    dayOfMonth: number | null,
    startTime: string,
    endTime: string
  ) => {
    if (!user) return;

    try {
      const { data, error: insertError } = await supabase
        .from('appointment_recurrences')
        .insert([
          {
            therapist_id: user.id,
            patient_id: patientId,
            start_date: startDate,
            end_date: endDate,
            frequency,
            day_of_week: dayOfWeek,
            day_of_month: dayOfMonth,
            start_time: startTime,
            end_time: endTime,
            is_active: true
          }
        ])
        .select();

      if (insertError) {
        throw insertError;
      }

      // Gerar agendamentos para a recorrência
      await supabase.rpc('generate_recurring_appointments');

      return data?.[0];
    } catch (err) {
      console.error('Erro ao criar recorrência:', err);
      throw err;
    }
  };

  const updateRecurrence = async (
    id: string,
    updates: Partial<AppointmentRecurrence>
  ) => {
    try {
      const { data, error: updateError } = await supabase
        .from('appointment_recurrences')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) {
        throw updateError;
      }

      return data?.[0];
    } catch (err) {
      console.error('Erro ao atualizar recorrência:', err);
      throw err;
    }
  };

  const deleteRecurrence = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('appointment_recurrences')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }
    } catch (err) {
      console.error('Erro ao deletar recorrência:', err);
      throw err;
    }
  };

  return {
    recurrences,
    loading,
    error,
    createRecurrence,
    updateRecurrence,
    deleteRecurrence
  };
};
