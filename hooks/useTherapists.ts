import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface Therapist {
  id: string;
  name: string;
  email: string;
  role: 'therapist_a' | 'therapist_b';
}

// IDs dos terapeutas (criados no Supabase)
const THERAPIST_IDS = {
  nadi: '83273ffc-c878-4abc-a24b-e35fd4801339',
  marcelo: '028d8869-679f-4093-b435-1a43b6ced0e2',
};

export const useTherapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar os dois terapeutas específicos pelos IDs
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('id, name, email, role')
          .in('id', [THERAPIST_IDS.nadi, THERAPIST_IDS.marcelo]);

        if (fetchError) {
          console.error('Erro ao buscar terapeutas:', fetchError);
          setError(fetchError.message);
          return;
        }

        if (data) {
          setTherapists(data as Therapist[]);
        }
      } catch (err) {
        console.error('Erro ao buscar terapeutas:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar terapeutas');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  return { therapists, loading, error };
};
