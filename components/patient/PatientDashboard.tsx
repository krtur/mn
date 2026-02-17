import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useMessages } from '../../hooks/useMessages';
import { useDocuments } from '../../hooks/useDocuments';
import { Calendar, MessageSquare, FileText, Zap, Plus, Send } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { conversations, loading: messagesLoading } = useMessages();
  const { documents, loading: documentsLoading } = useDocuments();

  // Mostrar loading apenas enquanto carrega o usuário
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando dashboard...</p>
      </div>
    );
  }

  // Calcular estatísticas
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.start_time) > new Date() && apt.status !== 'cancelled'
  );

  const unreadMessages = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

  const nextAppointment = upcomingAppointments.length > 0
    ? upcomingAppointments[0]
    : null;

  const nextSessionDisplay = nextAppointment
    ? new Date(nextAppointment.start_time).toLocaleDateString('pt-BR')
    : 'Nenhuma';

  const quickStats = [
    { label: 'Agendamentos', value: appointments.length.toString(), icon: Calendar, color: 'bg-blue-50 text-blue-600', path: '/dashboard/patient/appointments' },
    { label: 'Mensagens', value: unreadMessages.toString(), icon: MessageSquare, color: 'bg-green-50 text-green-600', path: '/dashboard/patient/messages' },
    { label: 'Documentos', value: documents.length.toString(), icon: FileText, color: 'bg-purple-50 text-purple-600', path: '/dashboard/patient/reports' },
    { label: 'Próxima Sessão', value: nextSessionDisplay, icon: Zap, color: 'bg-orange-50 text-orange-600', path: '/dashboard/patient/appointments' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Bem-vindo, {user.name}! 👋</h1>
        <p className="text-teal-100">Gerencie seus agendamentos, mensagens e documentos em um único lugar.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.path}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-teal-600 hover:border-teal-700 hover:scale-105 transform"
            >
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent size={24} />
              </div>
              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos Agendamentos */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="text-teal-600" size={28} />
              Próximos Agendamentos
            </h2>
            <Link
              to="/dashboard/patient/appointments"
              className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
            >
              Ver todos →
            </Link>
          </div>

          <div className="space-y-3">
            {appointmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="ml-2 text-slate-600 text-sm">Carregando agendamentos...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="border-l-4 border-teal-600 pl-4 py-3 bg-slate-50 rounded-r-lg hover:bg-slate-100 transition-colors">
                  <p className="font-semibold text-slate-900">
                    Sessão com {apt.therapist?.name || 'Terapeuta'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    📅 {new Date(apt.start_time).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {apt.status === 'pending' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      ⏳ Pendente de confirmação
                    </span>
                  )}
                  {apt.status === 'confirmed' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      ✅ Confirmado
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <p className="font-semibold text-slate-900 mb-2">Nenhum agendamento próximo</p>
                <p className="text-sm text-slate-600 mb-4">Clique abaixo para agendar sua primeira sessão</p>
                <Link
                  to="/dashboard/patient/appointments"
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Agendar Sessão
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="text-orange-600" size={28} />
            Ações Rápidas
          </h2>

          <div className="space-y-3">
            <Link
              to="/dashboard/patient/appointments"
              className="flex items-center gap-3 w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus size={20} />
              Novo Agendamento
            </Link>

            <Link
              to="/dashboard/patient/messages"
              className="flex items-center gap-3 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Send size={20} />
              Enviar Mensagem
            </Link>

            <Link
              to="/dashboard/patient/reports"
              className="flex items-center gap-3 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <FileText size={20} />
              Meus Relatórios
            </Link>

            {user?.tdah_screening_enabled && (
              <Link
                to="/dashboard/patient/tdah-screening"
                className="flex items-center gap-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Zap size={20} />
                Triagem TDAH
              </Link>
            )}

            <Link
              to="/dashboard/patient/test-shop"
              className="flex items-center gap-3 w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Zap size={20} />
              Loja de Testes
            </Link>
          </div>
        </div>
      </div>

      {/* Mensagens Recentes */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-green-600" size={28} />
            Mensagens Recentes
          </h2>
          <Link
            to="/dashboard/patient/messages"
            className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            Ver todas →
          </Link>
        </div>

        {messagesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="ml-2 text-slate-600 text-sm">Carregando mensagens...</p>
          </div>
        ) : conversations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations.slice(0, 3).map((conv) => (
              <Link
                key={conv.other_user_id}
                to="/dashboard/patient/messages"
                className="border border-slate-200 rounded-lg p-4 hover:border-teal-600 hover:shadow-md transition-all duration-300"
              >
                <p className="font-semibold text-slate-900">{conv.other_user_name}</p>
                <p className="text-sm text-slate-600 mt-1 truncate">{conv.last_message || 'Nenhuma mensagem'}</p>
                {conv.unread_count > 0 && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {conv.unread_count} nova{conv.unread_count > 1 ? 's' : ''}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600">Nenhuma conversa ainda</p>
            <Link
              to="/dashboard/patient/messages"
              className="inline-block mt-4 text-teal-600 hover:text-teal-700 font-semibold"
            >
              Iniciar conversa →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
