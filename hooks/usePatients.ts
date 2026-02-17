import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface Patient {
  id: string;
  email: string;
  name: string;
  phone: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  tdah_screening_enabled?: boolean;
  tdah_screening_paid?: boolean;
}

export const usePatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.role.startsWith('therapist')) {
      setLoading(false);
      setPatients([]);
      return;
    }

    // VALIDAÇÃO DE SEGURANÇA: Garantir que user.id é válido
    if (!user.id || user.id.trim() === '') {
      console.error('❌ ERRO DE SEGURANÇA: user.id inválido!', user.id);
      setError('Erro de autenticação: ID do usuário inválido');
      setLoading(false);
      setPatients([]);
      return;
    }

    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Buscando pacientes para terapeuta:', user.id, 'Nome:', user.name);

        // Buscar pacientes que foram cadastrados com este terapeuta (therapist_id)
        const { data: patientsData, error: patientsError } = await supabase
          .from('users')
          .select('*')
          .eq('therapist_id', user.id)
          .eq('role', 'patient');

        if (patientsError) {
          console.error('❌ Erro ao buscar pacientes:', patientsError);
          setError(patientsError.message);
          setPatients([]);
          return;
        }

        console.log('✅ Pacientes carregados:', patientsData?.length || 0, 'para terapeuta', user.name);
        setPatients(patientsData || []);
      } catch (err) {
        console.error('❌ Erro ao buscar pacientes:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar pacientes');
        setPatients([]);
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `therapist_id=eq.${user.id}`
        },
        () => {
          console.log('🔄 Detectada alteração em pacientes, recarregando...');
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
