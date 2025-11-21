import React, { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  patientName: string;
  lastMessage: string;
  unread: boolean;
}

export const Messages: React.FC = () => {
  const [conversations] = useState<Conversation[]>([
    { id: '1', patientName: 'João Silva', lastMessage: 'Obrigado pela sessão!', unread: true },
    { id: '2', patientName: 'Maria Santos', lastMessage: 'Tudo bem?', unread: false },
    { id: '3', patientName: 'Pedro Costa', lastMessage: 'Quando é a próxima sessão?', unread: true },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'João Silva',
      content: 'Oi! Como você está?',
      timestamp: '10:30',
      isOwn: false,
    },
    {
      id: '2',
      sender: 'Você',
      content: 'Oi João! Tudo bem?',
      timestamp: '10:35',
      isOwn: true,
    },
    {
      id: '3',
      sender: 'João Silva',
      content: 'Obrigado pela sessão!',
      timestamp: '10:40',
      isOwn: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          sender: 'Você',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
        },
      ]);
      setNewMessage('');
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
          <div className="divide-y divide-slate-200">
            {conversations.map((conv) => (
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
                  <p className={`font-semibold ${conv.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {conv.patientName}
                  </p>
                  {conv.unread && <span className="w-2 h-2 bg-teal-600 rounded-full"></span>}
                </div>
                <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">
              Conversa com {conversations.find((c) => c.id === selectedConversation)?.patientName}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? 'text-teal-100' : 'text-slate-600'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
