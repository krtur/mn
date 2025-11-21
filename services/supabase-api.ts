/**
 * API Service com Supabase
 * Funções para interagir com o banco de dados
 */

import { supabase } from './supabase';
import type { AppointmentType, MessageType, DocumentType, UserType } from './supabase';

// ==================== AGENDAMENTOS ====================

export const appointmentAPI = {
  /**
   * Listar agendamentos
   */
  async list(filters?: {
    patientId?: string;
    therapistId?: string;
    status?: string;
  }) {
    try {
      let query = supabase.from('appointments').select('*');

      if (filters?.patientId) {
        query = query.eq('patient_id', filters.patientId);
      }
      if (filters?.therapistId) {
        query = query.eq('therapist_id', filters.therapistId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('start_time', { ascending: false });

      if (error) throw error;
      return data as AppointmentType[];
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw error;
    }
  },

  /**
   * Obter detalhes de um agendamento
   */
  async get(id: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as AppointmentType;
    } catch (error) {
      console.error('Erro ao obter agendamento:', error);
      throw error;
    }
  },

  /**
   * Criar novo agendamento
   */
  async create(data: {
    patientId: string;
    therapistId: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) {
    try {
      const { data: result, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: data.patientId,
            therapist_id: data.therapistId,
            start_time: data.startTime,
            end_time: data.endTime,
            notes: data.notes,
            status: 'pending',
          },
        ])
        .select();

      if (error) throw error;
      return result?.[0] as AppointmentType;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  /**
   * Atualizar agendamento
   */
  async update(id: string, data: Partial<AppointmentType>) {
    try {
      const { data: result, error } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', id)
        .select();

      if (error) throw error;
      return result?.[0] as AppointmentType;
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  },

  /**
   * Deletar agendamento
   */
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  },

  /**
   * Confirmar agendamento
   */
  async confirm(id: string) {
    return this.update(id, { status: 'confirmed' });
  },

  /**
   * Cancelar agendamento
   */
  async cancel(id: string) {
    return this.update(id, { status: 'cancelled' });
  },
};

// ==================== MENSAGENS ====================

export const messageAPI = {
  /**
   * Listar mensagens de uma conversa
   */
  async list(conversationWith: string, limit = 50) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},recipient_id.eq.${user.id})`
        )
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as MessageType[]).reverse();
    } catch (error) {
      console.error('Erro ao listar mensagens:', error);
      throw error;
    }
  },

  /**
   * Enviar mensagem
   */
  async send(data: { recipientId: string; content: string }) {
    try {
      const { data: result, error } = await supabase
        .from('messages')
        .insert([
          {
            recipient_id: data.recipientId,
            content: data.content,
          },
        ])
        .select();

      if (error) throw error;
      return result?.[0] as MessageType;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  /**
   * Marcar mensagem como lida
   */
  async markAsRead(messageId: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      throw error;
    }
  },

  /**
   * Listar conversas
   */
  async listConversations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, recipient_id')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Extrair IDs únicos de conversas
      const conversationIds = new Set<string>();
      (data as any[]).forEach((msg) => {
        if (msg.sender_id !== user.id) conversationIds.add(msg.sender_id);
        if (msg.recipient_id !== user.id) conversationIds.add(msg.recipient_id);
      });

      return Array.from(conversationIds);
    } catch (error) {
      console.error('Erro ao listar conversas:', error);
      throw error;
    }
  },
};

// ==================== DOCUMENTOS ====================

export const documentAPI = {
  /**
   * Listar documentos
   */
  async list(filters?: { patientId?: string; type?: string }) {
    try {
      let query = supabase.from('documents').select('*');

      if (filters?.patientId) {
        query = query.eq('patient_id', filters.patientId);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as DocumentType[];
    } catch (error) {
      console.error('Erro ao listar documentos:', error);
      throw error;
    }
  },

  /**
   * Obter detalhes de um documento
   */
  async get(id: string) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as DocumentType;
    } catch (error) {
      console.error('Erro ao obter documento:', error);
      throw error;
    }
  },

  /**
   * Criar novo documento
   */
  async create(data: {
    patientId: string;
    type: 'report' | 'diagnosis' | 'progress_note';
    title: string;
    content: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Usuário não autenticado');

      const { data: result, error } = await supabase
        .from('documents')
        .insert([
          {
            patient_id: data.patientId,
            therapist_id: user.id,
            type: data.type,
            title: data.title,
            content: data.content,
          },
        ])
        .select();

      if (error) throw error;
      return result?.[0] as DocumentType;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      throw error;
    }
  },

  /**
   * Atualizar documento
   */
  async update(id: string, data: Partial<DocumentType>) {
    try {
      const { data: result, error } = await supabase
        .from('documents')
        .update(data)
        .eq('id', id)
        .select();

      if (error) throw error;
      return result?.[0] as DocumentType;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  },

  /**
   * Deletar documento
   */
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  },
};

// ==================== USUÁRIOS ====================

export const userAPI = {
  /**
   * Obter perfil do usuário
   */
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as UserType;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  },

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(userId: string, data: Partial<UserType>) {
    try {
      const { data: result, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId)
        .select();

      if (error) throw error;
      return result?.[0] as UserType;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  /**
   * Listar pacientes (para terapeutas)
   */
  async listPatients(search?: string) {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .eq('role', 'patient');

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,cpf.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserType[];
    } catch (error) {
      console.error('Erro ao listar pacientes:', error);
      throw error;
    }
  },
};

// ==================== REALTIME ====================

export const realtimeAPI = {
  /**
   * Escutar mudanças em tempo real
   */
  subscribeToMessages(callback: (message: MessageType) => void) {
    // @ts-ignore - O método .on() está disponível no Supabase Realtime
    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        callback(payload.new as MessageType);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  /**
   * Escutar mudanças em agendamentos
   */
  subscribeToAppointments(callback: (appointment: AppointmentType) => void) {
    // @ts-ignore - O método .on() está disponível no Supabase Realtime
    const subscription = supabase
      .channel('appointments-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
        callback(payload.new as AppointmentType);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
};

// ==================== EXPORT ====================

export const supabaseAPI = {
  appointment: appointmentAPI,
  message: messageAPI,
  document: documentAPI,
  user: userAPI,
  realtime: realtimeAPI,
};

export default supabaseAPI;
