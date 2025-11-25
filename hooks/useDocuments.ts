import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface Document {
  id: string;
  patient_id: string;
  therapist_id: string;
  type: 'report' | 'diagnosis' | 'progress_note';
  title: string;
  content: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  patient?: { name: string; email: string };
  therapist?: { name: string; email: string };
}

export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // VALIDAÇÃO DE SEGURANÇA: Garantir que user.id é válido
    if (!user.id || user.id.trim() === '') {
      console.error('❌ ERRO DE SEGURANÇA: user.id inválido em useDocuments!', user.id);
      setError('Erro de autenticação: ID do usuário inválido');
      setLoading(false);
      setDocuments([]);
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Buscando documentos para usuário:', user.id, 'Role:', user.role);

        let query = supabase
          .from('documents')
          .select(`
            *,
            patient:patient_id(name, email),
            therapist:therapist_id(name, email)
          `);

        // Se for paciente, buscar documentos do paciente
        if (user.role === 'patient') {
          query = query.eq('patient_id', user.id);
        }
        // Se for terapeuta, buscar documentos criados pelo terapeuta
        else if (user.role.startsWith('therapist')) {
          query = query.eq('therapist_id', user.id);
        }

        // Ordenar por data de criação
        query = query.order('created_at', { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Erro ao buscar documentos:', fetchError);
          setError(fetchError.message);
          return;
        }

        setDocuments(data || []);
      } catch (err) {
        console.error('Erro ao buscar documentos:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar documentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('documents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: user.role === 'patient' 
            ? `patient_id=eq.${user.id}` 
            : `therapist_id=eq.${user.id}`
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { documents, loading, error };
};
