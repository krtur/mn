import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: { name: string; email: string; role?: string };
  recipient?: { name: string; email: string; role?: string };
}

export interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_email: string;
  other_user_role?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // VALIDAÇÃO DE SEGURANÇA: Garantir que user.id é válido
    if (!user.id || user.id.trim() === '') {
      console.error('❌ ERRO DE SEGURANÇA: user.id inválido em useMessages!', user.id);
      setError('Erro de autenticação: ID do usuário inválido');
      setLoading(false);
      setConversations([]);
      return;
    }

    let isMounted = true;

    const fetchConversations = async () => {
      try {
        if (!isMounted) return;
        // Só mostrar loading na primeira vez
        if (isFirstLoad.current) {
          setLoading(true);
        }
        setError(null);

        console.log('🔍 Buscando mensagens para usuário:', user.id, 'Role:', user.role);

        // CORREÇÃO DE SEGURANÇA: Se for terapeuta, primeiro buscar IDs dos pacientes
        let therapistPatientIds: string[] = [];
        
        if (user.role.startsWith('therapist')) {
          try {
            const { data: patientData, error: patientError } = await supabase
              .from('users')
              .select('id')
              .eq('role', 'patient')
              .eq('therapist_id', user.id);
            
            if (patientError) {
              console.error('❌ Erro ao buscar IDs de pacientes:', patientError);
            } else {
              therapistPatientIds = (patientData || []).map(p => p.id);
              console.log('🔍 Pacientes encontrados para terapeuta', user.name, ':', therapistPatientIds.length);
            }
          } catch (err) {
            console.error('❌ Erro ao buscar pacientes do terapeuta:', err);
          }
        }
        
        // Construir filtro para mensagens
        let messageFilter = `sender_id.eq.${user.id},recipient_id.eq.${user.id}`;
        
        // Se for terapeuta, adicionar filtro para mensagens de seus pacientes
        if (user.role.startsWith('therapist') && therapistPatientIds.length > 0) {
          // Adicionar cada paciente ao filtro OR
          const patientFilters = therapistPatientIds.map(patientId => 
            `sender_id.eq.${patientId},recipient_id.eq.${patientId}`
          );
          messageFilter = `${messageFilter},${patientFilters.join(',')}`;
        }
        
        console.log('🔍 Buscando mensagens com filtro:', messageFilter);
        
        // Buscar mensagens com filtro aprimorado
        const { data: allMessages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(name, email, role),
            recipient:recipient_id(name, email, role)
          `)
          .or(messageFilter)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Erro ao buscar mensagens:', messagesError);
          if (isMounted) setError(messagesError.message);
          return;
        }

        if (isMounted) {
          setMessages(allMessages || []);

          // Agrupar em conversas
          const conversationMap = new Map<string, Conversation>();

          // Buscar lista de IDs de pacientes deste terapeuta para filtrar mensagens
          let therapistPatientIds: string[] = [];
          
          // Se é terapeuta, buscar IDs dos pacientes para filtrar mensagens
          if (user.role.startsWith('therapist')) {
            try {
              const { data: patientData } = await supabase
                .from('users')
                .select('id')
                .eq('role', 'patient')
                .eq('therapist_id', user.id);
              
              therapistPatientIds = (patientData || []).map(p => p.id);
              console.log('🔍 Filtrando mensagens para', therapistPatientIds.length, 'pacientes do terapeuta', user.name);
            } catch (err) {
              console.error('❌ Erro ao buscar IDs de pacientes para filtrar mensagens:', err);
            }
          }

          (allMessages || []).forEach((msg) => {
            const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
            const otherUser = msg.sender_id === user.id ? msg.recipient : msg.sender;

            // CORREÇÃO DE SEGURANÇA: Filtrar mensagens
            // Se é paciente, filtrar apenas conversas com seu terapeuta
            if (user.role === 'patient' && !otherUser?.role?.startsWith('therapist')) {
              return;
            }
            
            // Se é terapeuta, filtrar apenas mensagens de seus pacientes
            if (user.role.startsWith('therapist') && 
                otherUser?.role === 'patient' && 
                !therapistPatientIds.includes(otherUserId)) {
              console.log('🔒 Ignorando mensagem de paciente não associado:', otherUser?.name || otherUserId);
              return;
            }

            if (!conversationMap.has(otherUserId)) {
              conversationMap.set(otherUserId, {
                id: otherUserId,
                other_user_id: otherUserId,
                other_user_name: otherUser?.name || 'Usuário',
                other_user_email: otherUser?.email || '',
                other_user_role: otherUser?.role,
                last_message: msg.content,
                last_message_time: msg.created_at,
                unread_count: msg.read ? 0 : (msg.recipient_id === user.id ? 1 : 0),
              });
            } else {
              const conv = conversationMap.get(otherUserId)!;
              if (!msg.read && msg.recipient_id === user.id) {
                conv.unread_count++;
              }
            }
          });

          setConversations(Array.from(conversationMap.values()));
          if (isFirstLoad.current) {
            setLoading(false);
            isFirstLoad.current = false;
          }
        }
      } catch (err) {
        console.error('Erro ao buscar conversas:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao buscar mensagens');
          if (isFirstLoad.current) {
            setLoading(false);
            isFirstLoad.current = false;
          }
        }
      }
    };

    fetchConversations();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`messages-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Refetch imediatamente quando uma nova mensagem chegar
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  return { messages, conversations, loading, error };
};
