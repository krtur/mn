import { useState } from 'react';
import { supabase, supabaseAuth } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface PatientInvite {
  id?: string;
  email: string;
  name: string;
  therapist_id: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at?: string;
  expires_at?: string;
}

export interface PatientFormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password?: string;
}

export const usePatientManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Função para criar um paciente diretamente (com senha)
  const createPatient = async (patientData: PatientFormData) => {
    if (!user || !user.role.startsWith('therapist')) {
      setError('Apenas terapeutas podem cadastrar pacientes');
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔍 Iniciando cadastro de paciente:', patientData.name);

      // 1. Criar usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabaseAuth.signUp({
        email: patientData.email,
        password: patientData.password || generateRandomPassword(),
        options: {
          data: {
            name: patientData.name,
          },
        },
      });

      if (authError) {
        console.error('❌ Erro ao criar usuário no Auth:', authError);
        setError(authError.message);
        return null;
      }

      if (!authData.user) {
        setError('Erro ao criar usuário');
        return null;
      }

      // 2. Criar registro do usuário na tabela users
      const userRecord = {
        id: authData.user.id,
        email: patientData.email,
        name: patientData.name,
        cpf: patientData.cpf,
        phone: patientData.phone,
        role: 'patient',
        therapist_id: user.id,
      };

      const { error: dbError } = await supabase
        .from('users')
        .insert([userRecord]);

      if (dbError) {
        console.error('❌ Erro ao criar usuário na tabela:', dbError);
        setError(dbError.message);
        return null;
      }

      console.log('✅ Paciente cadastrado com sucesso:', patientData.name);
      setSuccess(`Paciente ${patientData.name} cadastrado com sucesso!`);
      return userRecord;
    } catch (err) {
      console.error('❌ Erro ao cadastrar paciente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar paciente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar convite por email
  const sendInvite = async (patientData: Omit<PatientFormData, 'password' | 'cpf' | 'phone'>) => {
    if (!user || !user.role.startsWith('therapist')) {
      setError('Apenas terapeutas podem enviar convites');
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔍 Enviando convite para:', patientData.email);

      // 1. Verificar se o email já está cadastrado
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', patientData.email)
        .single();

      if (existingUser) {
        setError(`O email ${patientData.email} já está cadastrado`);
        return null;
      }

      // 2. Gerar token de convite (válido por 7 dias)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // 3. Salvar convite no banco de dados
      const inviteData: PatientInvite = {
        email: patientData.email,
        name: patientData.name,
        therapist_id: user.id,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      };

      const { data: invite, error: inviteError } = await supabase
        .from('patient_invites')
        .insert([inviteData])
        .select()
        .single();

      if (inviteError) {
        console.error('❌ Erro ao criar convite:', inviteError);
        setError(inviteError.message);
        return null;
      }

      // 4. Enviar email com link de convite
      // Nota: Em um ambiente real, você usaria um serviço de email como SendGrid, Mailgun, etc.
      // Para este exemplo, vamos simular o envio de email
      console.log(`✉️ Email de convite enviado para ${patientData.email}`);
      console.log(`Link de convite: ${window.location.origin}/register?invite=${invite.id}`);

      setSuccess(`Convite enviado para ${patientData.email}`);
      return invite;
    } catch (err) {
      console.error('❌ Erro ao enviar convite:', err);
      setError(err instanceof Error ? err.message : 'Erro ao enviar convite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para listar convites enviados
  const listInvites = async () => {
    if (!user || !user.role.startsWith('therapist')) {
      setError('Apenas terapeutas podem ver convites');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data: invites, error: invitesError } = await supabase
        .from('patient_invites')
        .select('*')
        .eq('therapist_id', user.id)
        .order('created_at', { ascending: false });

      if (invitesError) {
        console.error('❌ Erro ao buscar convites:', invitesError);
        setError(invitesError.message);
        return [];
      }

      return invites || [];
    } catch (err) {
      console.error('❌ Erro ao listar convites:', err);
      setError(err instanceof Error ? err.message : 'Erro ao listar convites');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para cancelar um convite
  const cancelInvite = async (inviteId: string) => {
    if (!user || !user.role.startsWith('therapist')) {
      setError('Apenas terapeutas podem cancelar convites');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: cancelError } = await supabase
        .from('patient_invites')
        .update({ status: 'expired' })
        .eq('id', inviteId)
        .eq('therapist_id', user.id);

      if (cancelError) {
        console.error('❌ Erro ao cancelar convite:', cancelError);
        setError(cancelError.message);
        return false;
      }

      setSuccess('Convite cancelado com sucesso');
      return true;
    } catch (err) {
      console.error('❌ Erro ao cancelar convite:', err);
      setError(err instanceof Error ? err.message : 'Erro ao cancelar convite');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para gerar senha aleatória
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return {
    createPatient,
    sendInvite,
    listInvites,
    cancelInvite,
    loading,
    error,
    success,
  };
};
