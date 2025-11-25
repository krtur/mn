import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface SessionHistory {
  id: string;
  appointment_id: string;
  patient_id: string;
  therapist_id: string;
  session_date: string;
  duration_minutes: number;
  status: 'completed' | 'no_show' | 'cancelled' | 'rescheduled';
  notes: string;
  created_at: string;
}

export const useSessionHistory = (patientId: string | null) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId || !user?.id) {
      setSessions([]);
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from('session_history')
          .select('*')
          .eq('patient_id', patientId)
          .eq('therapist_id', user.id)
          .order('session_date', { ascending: false });

        if (err) throw err;
        setSessions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar histórico de sessões');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`session_history:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_history',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [patientId, user?.id]);

  const recordSession = async (
    appointmentId: string,
    durationMinutes: number,
    status: 'completed' | 'no_show' | 'cancelled' | 'rescheduled',
    notes: string
  ) => {
    if (!patientId || !user?.id) return;

    try {
      const { data, error: err } = await supabase
        .from('session_history')
        .insert([
          {
            appointment_id: appointmentId,
            patient_id: patientId,
            therapist_id: user.id,
            session_date: new Date().toISOString(),
            duration_minutes: durationMinutes,
            status,
            notes,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (err) throw err;
      setSessions([data, ...sessions]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar sessão');
      throw err;
    }
  };

  const getStatistics = () => {
    const total = sessions.length;
    const completed = sessions.filter(s => s.status === 'completed').length;
    const noShow = sessions.filter(s => s.status === 'no_show').length;
    const cancelled = sessions.filter(s => s.status === 'cancelled').length;
    const avgDuration = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / sessions.length)
      : 0;

    return {
      total,
      completed,
      noShow,
      cancelled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      avgDuration,
    };
  };

  const getRecentSessions = (limit: number = 5) => {
    return sessions.slice(0, limit);
  };

  return {
    sessions,
    loading,
    error,
    recordSession,
    getStatistics,
    getRecentSessions,
  };
};
