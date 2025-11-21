import React, { useState, useEffect } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabase';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { conversations, messages: allMessages, loading, error } = useMessages();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Carregar mensagens da conversa selecionada
  useEffect(() => {
    if (selectedConversationId) {
      const msgs = allMessages.filter(
        (msg) =>
          (msg.sender_id === user?.id && msg.recipient_id === selectedConversationId) ||
          (msg.sender_id === selectedConversationId && msg.recipient_id === user?.id)
      );
      setConversationMessages(msgs);
    }
  }, [selectedConversationId, allMessages, user?.id]);

  // Selecionar primeira conversa por padrão
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando mensagens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Erro ao carregar mensagens</p>
        <p className="text-sm">{error}</p>
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Mensagens</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Conversas</h2>
          </div>
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-slate-600">
              <p>Nenhuma conversa ainda</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConversationId === conv.id
                      ? 'bg-teal-50 border-l-4 border-teal-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{conv.other_user_name}</p>
                      <p className="text-sm text-slate-600 truncate">{conv.last_message}</p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedConversationId && conversations.find((c) => c.id === selectedConversationId) ? (
            <>
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">
                  Conversa com {conversations.find((c) => c.id === selectedConversationId)?.other_user_name}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.length === 0 ? (
                  <div className="text-center text-slate-600 py-8">
                    <p>Nenhuma mensagem ainda</p>
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
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender_id === user?.id ? 'text-teal-100' : 'text-slate-600'
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
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 flex gap-2">
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
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-400"
                >
                  {sendingMessage ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-slate-600">
              <p>Selecione uma conversa para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
