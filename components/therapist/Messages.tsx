import React, { useState } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabase';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { conversations: allConversations, messages: allMessages, loading } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    allConversations.length > 0 ? allConversations[0].id : null
  );
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Filtrar mensagens da conversa selecionada
  const selectedMessages = selectedConversation
    ? allMessages.filter((msg) => {
        const isFromSelected =
          (msg.sender_id === user?.id && msg.recipient_id === selectedConversation) ||
          (msg.recipient_id === user?.id && msg.sender_id === selectedConversation);
        return isFromSelected;
      })
    : [];

  const selectedConversationData = allConversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation,
          content: newMessage,
          read: false,
        });

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando mensagens...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Mensagens</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Conversas ({allConversations.length})</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {allConversations.length > 0 ? (
              allConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    selectedConversation === conv.id
                      ? 'bg-teal-50 border-l-4 border-teal-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold ${conv.unread_count > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                      {conv.other_user_name}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 truncate">{conv.last_message}</p>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-600">
                <p>Nenhuma conversa ainda</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">
              {selectedConversationData ? `Conversa com ${selectedConversationData.other_user_name}` : 'Selecione uma conversa'}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedMessages.length > 0 ? (
              selectedMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender_id === user?.id
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-teal-100' : 'text-slate-600'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600">
                <p>{selectedConversation ? 'Nenhuma mensagem nesta conversa' : 'Selecione uma conversa para começar'}</p>
              </div>
            )}
          </div>

          {selectedConversation && (
            <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={sending}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-400"
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
