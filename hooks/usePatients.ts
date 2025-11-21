import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface Patient {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export const usePatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.role.startsWith('therapist')) {
      setLoading(false);
      return;
    }

    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar pacientes que foram cadastrados com este terapeuta (therapist_id)
        const { data: patientsData, error: patientsError } = await supabase
          .from('users')
          .select('*')
          .eq('therapist_id', user.id)
          .eq('role', 'patient');

        if (patientsError) {
          console.error('Erro ao buscar pacientes:', patientsError);
          setError(patientsError.message);
          return;
        }

        setPatients(patientsData || []);
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar pacientes');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('patients')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `therapist_id=eq.${user.id}`
        },
        () => {
          fetchPatients();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { patients, loading, error };
};
