import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/auth/AuthContext';

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  unread_count: number;
}

export const useContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchContacts = async () => {
      try {
        if (!isMounted) return;
        // Só mostrar loading na primeira vez
        if (isFirstLoad.current) {
          setLoading(true);
        }
        setError(null);

        let contactsData: any[] = [];

        // Se é paciente, buscar seu terapeuta
        if (user.role === 'patient') {
          if (user.therapist_id) {
            const { data, error: err } = await supabase
              .from('users')
              .select('id, name, email, role')
              .eq('id', user.therapist_id)
              .single();

            if (err) {
              console.error('Erro ao buscar terapeuta:', err);
            } else if (data) {
              contactsData = [data];
            }
          }
        } else {
          // Se é terapeuta, buscar todos os pacientes
          const { data, error: err } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('role', 'patient');

          if (err) {
            console.error('Erro ao buscar pacientes:', err);
          } else {
            contactsData = data || [];
          }
        }

        // Buscar contagem de mensagens não lidas para cada contato
        const contactsWithUnread = await Promise.all(
          contactsData.map(async (contact) => {
            const { count, error: countErr } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('recipient_id', user.id)
              .eq('sender_id', contact.id)
              .eq('read', false);

            return {
              id: contact.id,
              name: contact.name,
              email: contact.email,
              role: contact.role,
              unread_count: count || 0,
            };
          })
        );

        if (isMounted) {
          setContacts(contactsWithUnread);
          if (isFirstLoad.current) {
            setLoading(false);
            isFirstLoad.current = false;
          }
        }
      } catch (err) {
        console.error('Erro ao buscar contatos:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao buscar contatos');
          if (isFirstLoad.current) {
            setLoading(false);
            isFirstLoad.current = false;
          }
        }
      }
    };

    fetchContacts();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`messages-contacts-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchContacts();
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
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  return { contacts, loading, error };
};
