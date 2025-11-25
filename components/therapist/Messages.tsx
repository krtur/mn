import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useContacts } from '../../hooks/useContacts';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabase';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { messages: allMessages, loading: messagesLoading } = useMessages();
  const { contacts: allContacts, loading: contactsLoading } = useContacts();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    allContacts.length > 0 ? allContacts[0].id : null
  );
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation, allMessages]);

  // Filtrar mensagens da conversa selecionada
  const selectedMessages = selectedConversation
    ? allMessages.filter((msg) => {
        const isFromSelected =
          (msg.sender_id === user?.id && msg.recipient_id === selectedConversation) ||
          (msg.recipient_id === user?.id && msg.sender_id === selectedConversation);
        return isFromSelected;
      })
    : [];

  // Filtrar contatos por busca
  const filteredContacts = allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContactData = allContacts.find((c) => c.id === selectedConversation);

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
      alert('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const loading = messagesLoading || contactsLoading;

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
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mensagens</h1>
        <p className="text-slate-600 mt-1">Escolha um paciente para conversar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Conversas */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-3">Pacientes ({allContacts.length})</h2>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedConversation(contact.id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-slate-50 ${
                    selectedConversation === contact.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold text-sm ${contact.unread_count > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                      {contact.name}
                    </p>
                    {contact.unread_count > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {contact.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 truncate">{contact.email}</p>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-600">
                <p className="text-sm">Nenhuma conversa encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col h-[600px]">
          {selectedContactData ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900 text-lg">{selectedContactData.name}</h2>
                    <p className="text-sm text-slate-600">{selectedContactData.email}</p>
                  </div>
                  {selectedContactData.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-3 py-1">
                      {selectedContactData.unread_count} não lida{selectedContactData.unread_count > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {selectedMessages.length > 0 ? (
                  selectedMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
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
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-600">
                    <div className="text-center">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="font-medium">Nenhuma mensagem ainda</p>
                      <p className="text-sm">Comece a conversa enviando uma mensagem!</p>
                    </div>
                  </div>
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
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:bg-slate-400"
                >
                  {sending ? '...' : '📤'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-slate-600">
              <div className="text-center">
                <div className="text-5xl mb-4">🤔</div>
                <p className="font-medium">Nenhuma conversa disponível</p>
                <p className="text-sm">Selecione um paciente para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
