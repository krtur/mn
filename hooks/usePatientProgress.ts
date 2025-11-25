import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface ProgressEntry {
  id: string;
  patient_id: string;
  therapist_id: string;
  date: string;
  score: number; // 1-10
  category: string;
  notes: string;
  created_at: string;
}

export interface PatientGoal {
  id: string;
  patient_id: string;
  therapist_id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  target_date: string;
  created_at: string;
  updated_at: string;
}

export const usePatientProgress = (patientId: string | null) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [goals, setGoals] = useState<PatientGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId || !user?.id) {
      setProgress([]);
      setGoals([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch progress entries
        const { data: progressData, error: progressErr } = await supabase
          .from('patient_progress')
          .select('*')
          .eq('patient_id', patientId)
          .eq('therapist_id', user.id)
          .order('date', { ascending: false });

        if (progressErr) throw progressErr;

        // Fetch goals
        const { data: goalsData, error: goalsErr } = await supabase
          .from('patient_goals')
          .select('*')
          .eq('patient_id', patientId)
          .eq('therapist_id', user.id)
          .order('created_at', { ascending: false });

        if (goalsErr) throw goalsErr;

        setProgress(progressData || []);
        setGoals(goalsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar progresso');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const progressSub = supabase
      .channel(`patient_progress:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_progress',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const goalsSub = supabase
      .channel(`patient_goals:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_goals',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      progressSub.unsubscribe();
      goalsSub.unsubscribe();
    };
  }, [patientId, user?.id]);

  const addProgressEntry = async (
    date: string,
    score: number,
    category: string,
    notes: string
  ) => {
    if (!patientId || !user?.id) return;

    try {
      const { data, error: err } = await supabase
        .from('patient_progress')
        .insert([
          {
            patient_id: patientId,
            therapist_id: user.id,
            date,
            score,
            category,
            notes,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (err) throw err;
      setProgress([data, ...progress]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar entrada de progresso');
      throw err;
    }
  };

  const addGoal = async (
    title: string,
    description: string,
    targetDate: string
  ) => {
    if (!patientId || !user?.id) return;

    try {
      const { data, error: err } = await supabase
        .from('patient_goals')
        .insert([
          {
            patient_id: patientId,
            therapist_id: user.id,
            title,
            description,
            status: 'active',
            target_date: targetDate,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (err) throw err;
      setGoals([data, ...goals]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar meta');
      throw err;
    }
  };

  const updateGoal = async (
    goalId: string,
    status: 'active' | 'completed' | 'paused'
  ) => {
    try {
      const { data, error: err } = await supabase
        .from('patient_goals')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId)
        .select()
        .single();

      if (err) throw err;
      setGoals(goals.map(g => g.id === goalId ? data : g));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar meta');
      throw err;
    }
  };

  const getAverageScore = (category?: string) => {
    const filtered = category
      ? progress.filter(p => p.category === category)
      : progress;

    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, p) => acc + p.score, 0);
    return Math.round((sum / filtered.length) * 10) / 10;
  };

  const getProgressTrend = (category?: string, days: number = 30) => {
    const filtered = category
      ? progress.filter(p => p.category === category)
      : progress;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return filtered.filter(p => new Date(p.date) >= cutoffDate);
  };

  return {
    progress,
    goals,
    loading,
    error,
    addProgressEntry,
    addGoal,
    updateGoal,
    getAverageScore,
    getProgressTrend,
  };
};
