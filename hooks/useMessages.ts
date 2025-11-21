import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: { name: string; email: string };
  recipient?: { name: string; email: string };
}

export interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_email: string;
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

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar todas as mensagens do usuário
        const { data: allMessages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(name, email),
            recipient:recipient_id(name, email)
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) {
          console.error('Erro ao buscar mensagens:', messagesError);
          setError(messagesError.message);
          return;
        }

        setMessages(allMessages || []);

        // Agrupar em conversas
        const conversationMap = new Map<string, Conversation>();

        (allMessages || []).forEach((msg) => {
          const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
          const otherUser = msg.sender_id === user.id ? msg.recipient : msg.sender;

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              id: otherUserId,
              other_user_id: otherUserId,
              other_user_name: otherUser?.name || 'Usuário',
              other_user_email: otherUser?.email || '',
              last_message: msg.content,
              last_message_time: msg.created_at,
              unread_count: msg.read ? 0 : 1,
            });
          } else {
            const conv = conversationMap.get(otherUserId)!;
            if (!msg.read && msg.recipient_id === user.id) {
              conv.unread_count++;
            }
          }
        });

        setConversations(Array.from(conversationMap.values()));
      } catch (err) {
        console.error('Erro ao buscar conversas:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar mensagens');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { messages, conversations, loading, error };
};
