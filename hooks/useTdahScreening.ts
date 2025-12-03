import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface TdahScreeningResult {
  id: string;
  patient_id: string;
  therapist_id: string | null;
  answers: Record<number, number>;
  category_a_score: number;
  category_b_score: number;
  category_c_score: number;
  category_d_score: number;
  category_e_score: number;
  category_f_score: number;
  total_score: number;
  total_percentage: number;
  risk_level: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto';
  test_duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface TdahScreeningInput {
  answers: Record<number, number>;
  categoryScores: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
  totalScore: number;
  totalPercentage: number;
  testDuration: number | null;
}

export const useTdahScreening = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar nível de risco baseado na porcentagem
  const getRiskLevel = (percentage: number): TdahScreeningResult['risk_level'] => {
    if (percentage >= 75) return 'Muito Alto';
    if (percentage >= 50) return 'Alto';
    if (percentage >= 25) return 'Moderado';
    return 'Baixo';
  };

  // Salvar triagem TDAH
  const saveScreening = useCallback(
    async (data: TdahScreeningInput): Promise<TdahScreeningResult | null> => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.id) {
          throw new Error('Usuário não autenticado');
        }

        console.log('🔐 Usuário autenticado:', user.id);
        console.log('👤 Role do usuário:', user.role);

        const riskLevel = getRiskLevel(data.totalPercentage);
        console.log('📊 Nível de risco:', riskLevel);

        // Buscar o therapist_id do paciente
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('therapist_id')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('❌ Erro ao buscar therapist_id do paciente:', userError);
        }

        const therapistId = userData?.therapist_id || null;
        console.log('👨‍⚕️ Terapeuta do paciente:', therapistId);

        const screeningData = {
          patient_id: user.id,
          therapist_id: therapistId, // Adicionar o ID do terapeuta associado ao paciente
          answers: data.answers,
          category_a_score: data.categoryScores.A,
          category_b_score: data.categoryScores.B,
          category_c_score: data.categoryScores.C,
          category_d_score: data.categoryScores.D,
          category_e_score: data.categoryScores.E,
          category_f_score: data.categoryScores.F,
          total_score: data.totalScore,
          total_percentage: data.totalPercentage,
          risk_level: riskLevel,
          test_duration: data.testDuration,
        };

        console.log('📤 Enviando dados para Supabase:', screeningData);

        const { data: result, error: insertError } = await supabase
          .from('tdah_screenings')
          .insert([screeningData])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Erro do Supabase:', insertError);
          throw insertError;
        }

        console.log('✅ Triagem salva com sucesso:', result);
        return result as TdahScreeningResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao salvar triagem';
        setError(message);
        console.error('❌ Erro ao salvar triagem TDAH:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Buscar triagens do paciente
  const getPatientScreenings = useCallback(
    async (patientId: string): Promise<TdahScreeningResult[]> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('tdah_screenings')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        return (data || []) as TdahScreeningResult[];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar triagens';
        setError(message);
        console.error('Erro ao buscar triagens TDAH:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar triagem específica
  const getScreening = useCallback(
    async (screeningId: string): Promise<TdahScreeningResult | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('tdah_screenings')
          .select('*')
          .eq('id', screeningId)
          .single();

        if (fetchError) throw fetchError;

        return data as TdahScreeningResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar triagem';
        setError(message);
        console.error('Erro ao buscar triagem TDAH:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar triagens de um paciente específico (para terapeutas)
  const getTherapistPatientScreenings = useCallback(
    async (patientId: string): Promise<TdahScreeningResult[]> => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.id) {
          throw new Error('Usuário não autenticado');
        }

        console.log('🔍 Terapeuta buscando triagens:', user.id, 'para paciente:', patientId);

        // Buscar triagens do paciente
        const { data, error: fetchError } = await supabase
          .from('tdah_screenings')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Erro ao buscar triagens:', fetchError);
          throw fetchError;
        }

        console.log(`✓ Triagens encontradas para paciente ${patientId}:`, data?.length || 0);
        
        // Log detalhado das triagens encontradas para debug
        if (data && data.length > 0) {
          console.log('📊 Detalhes das triagens:', data.map(item => ({
            id: item.id,
            patient_id: item.patient_id,
            therapist_id: item.therapist_id,
            created_at: item.created_at
          })));
        }
        return (data || []) as TdahScreeningResult[];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar triagens';
        setError(message);
        console.error('Erro ao buscar triagens TDAH:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Atualizar triagem (adicionar notas do terapeuta, por exemplo)
  const updateScreening = useCallback(
    async (
      screeningId: string,
      updates: Partial<TdahScreeningResult>
    ): Promise<TdahScreeningResult | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: updateError } = await supabase
          .from('tdah_screenings')
          .update(updates)
          .eq('id', screeningId)
          .select()
          .single();

        if (updateError) throw updateError;

        return data as TdahScreeningResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao atualizar triagem';
        setError(message);
        console.error('Erro ao atualizar triagem TDAH:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    saveScreening,
    getPatientScreenings,
    getScreening,
    getTherapistPatientScreenings,
    updateScreening,
  };
};
