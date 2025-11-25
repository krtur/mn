import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useContacts } from '../../hooks/useContacts';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabase';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { messages: allMessages, loading: messagesLoading } = useMessages();
  const { contacts, loading: contactsLoading } = useContacts();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  // Carregar mensagens da conversa selecionada
  useEffect(() => {
    if (selectedConversationId) {
      const msgs = allMessages.filter(
        (msg) =>
          (msg.sender_id === user?.id && msg.recipient_id === selectedConversationId) ||
          (msg.sender_id === selectedConversationId && msg.recipient_id === user?.id)
      );
      setConversationMessages(msgs);

      // Marcar mensagens como lidas
      msgs.forEach((msg) => {
        if (msg.recipient_id === user?.id && !msg.read) {
          supabase
            .from('messages')
            .update({ read: true })
            .eq('id', msg.id)
            .then(() => {
              console.log('Mensagem marcada como lida:', msg.id);
            });
        }
      });
    }
  }, [selectedConversationId, allMessages, user?.id]);

  // Selecionar primeiro contato por padrão
  useEffect(() => {
    if (contacts.length > 0 && !selectedConversationId) {
      setSelectedConversationId(contacts[0].id);
    }
  }, [contacts, selectedConversationId]);

  const loading = messagesLoading || contactsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando mensagens...</p>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversationId) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: user.id,
          recipient_id: selectedConversationId,
          content: newMessage,
          read: false,
        },
      ]);

      if (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem');
      } else {
        setNewMessage('');
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Erro ao enviar mensagem');
    } finally {
      setSendingMessage(false);
    }
  };

  const therapist = contacts.length > 0 ? contacts[0] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mensagens</h1>
        <p className="text-slate-600 mt-1">Converse com seu terapeuta</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[600px]">
        {therapist ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 text-lg">{therapist.name}</h2>
                  <p className="text-sm text-slate-600">{therapist.email}</p>
                </div>
                {therapist.unread_count > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full px-3 py-1">
                    {therapist.unread_count} não lida{therapist.unread_count > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {conversationMessages.length === 0 ? (
                <div className="text-center text-slate-600 py-12">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="font-medium">Nenhuma mensagem ainda</p>
                  <p className="text-sm">Comece a conversa enviando uma mensagem!</p>
                </div>
              ) : (
                conversationMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender_id === user?.id
                          ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                          : 'bg-white text-slate-900 rounded-bl-none shadow border border-slate-200'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_id === user?.id ? 'text-teal-100' : 'text-slate-500'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 bg-white flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={sendingMessage}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={sendingMessage}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:bg-slate-400"
              >
                {sendingMessage ? '...' : '📤'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-slate-600">
            <div className="text-center">
              <div className="text-5xl mb-4">🤔</div>
              <p className="font-medium">Nenhuma conversa disponível</p>
              <p className="text-sm">Você ainda não tem um terapeuta associado</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
