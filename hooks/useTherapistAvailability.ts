import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface TherapistAvailability {
  id: string;
  therapist_id: string;
  day_of_week: number; // 0 = domingo, 1 = segunda, ..., 6 = sábado
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTherapistAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<TherapistAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.role.startsWith('therapist')) {
      setLoading(false);
      return;
    }

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('therapist_availability')
          .select('*')
          .eq('therapist_id', user.id)
          .order('day_of_week', { ascending: true });

        if (fetchError) {
          console.error('Erro ao buscar disponibilidade:', fetchError);
          setError(fetchError.message);
          return;
        }

        setAvailability(data || []);
      } catch (err) {
        console.error('Erro ao buscar disponibilidade:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar disponibilidade');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('therapist_availability')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'therapist_availability',
          filter: `therapist_id=eq.${user.id}`
        },
        () => {
          fetchAvailability();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addAvailability = async (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!user) return;

    try {
      const { data, error: insertError } = await supabase
        .from('therapist_availability')
        .insert([
          {
            therapist_id: user.id,
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            is_active: true
          }
        ])
        .select();

      if (insertError) {
        throw insertError;
      }

      return data?.[0];
    } catch (err) {
      console.error('Erro ao adicionar disponibilidade:', err);
      throw err;
    }
  };

  const removeAvailability = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('therapist_availability')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }
    } catch (err) {
      console.error('Erro ao remover disponibilidade:', err);
      throw err;
    }
  };

  const updateAvailability = async (id: string, startTime: string, endTime: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('therapist_availability')
        .update({
          start_time: startTime,
          end_time: endTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) {
        throw updateError;
      }

      return data?.[0];
    } catch (err) {
      console.error('Erro ao atualizar disponibilidade:', err);
      throw err;
    }
  };

  return {
    availability,
    loading,
    error,
    addAvailability,
    removeAvailability,
    updateAvailability
  };
};
