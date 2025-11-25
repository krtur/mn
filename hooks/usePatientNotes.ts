import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface PatientNote {
  id: string;
  patient_id: string;
  therapist_id: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const usePatientNotes = (patientId: string | null) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId || !user?.id) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from('patient_notes')
          .select('*')
          .eq('patient_id', patientId)
          .eq('therapist_id', user.id)
          .order('created_at', { ascending: false });

        if (err) throw err;
        setNotes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar notas');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`patient_notes:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_notes',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [patientId, user?.id]);

  const addNote = async (content: string, tags: string[] = []) => {
    if (!patientId || !user?.id) return;

    try {
      const { data, error: err } = await supabase
        .from('patient_notes')
        .insert([
          {
            patient_id: patientId,
            therapist_id: user.id,
            content,
            tags,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (err) throw err;
      setNotes([data, ...notes]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar nota');
      throw err;
    }
  };

  const updateNote = async (noteId: string, content: string, tags: string[]) => {
    try {
      const { data, error: err } = await supabase
        .from('patient_notes')
        .update({
          content,
          tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .select()
        .single();

      if (err) throw err;
      setNotes(notes.map(n => n.id === noteId ? data : n));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar nota');
      throw err;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error: err } = await supabase
        .from('patient_notes')
        .delete()
        .eq('id', noteId);

      if (err) throw err;
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar nota');
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
  };
};
