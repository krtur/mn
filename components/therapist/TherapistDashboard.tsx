import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useMessages } from '../../hooks/useMessages';
import { useDocuments } from '../../hooks/useDocuments';
import { usePatients } from '../../hooks/usePatients';

export const TherapistDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { conversations, loading: messagesLoading } = useMessages();
  const { documents, loading: documentsLoading } = useDocuments();
  const { patients, loading: patientsLoading } = usePatients();

  // Mostrar loading enquanto carrega
  if (isLoading || !user || appointmentsLoading || messagesLoading || documentsLoading || patientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando dashboard...</p>
      </div>
    );
  }

  // Calcular estatísticas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const appointmentsToday = appointments.filter((apt) => {
    const aptDate = new Date(apt.start_time);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime() && apt.status !== 'cancelled';
  });

  const appointmentsNextWeek = appointments.filter((apt) => {
    const aptDate = new Date(apt.start_time);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() > today.getTime() && aptDate.getTime() <= nextWeek.getTime() && apt.status !== 'cancelled';
  });

  const unreadMessages = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  const confirmedAppointments = appointments.filter((apt) => apt.status === 'confirmed').length;
  const pendingAppointments = appointments.filter((apt) => apt.status === 'pending').length;
  
  const documentsByType = {
    report: documents.filter((doc) => doc.type === 'report').length,
    diagnosis: documents.filter((doc) => doc.type === 'diagnosis').length,
    progress_note: documents.filter((doc) => doc.type === 'progress_note').length,
  };

  const confirmationRate = appointments.length > 0 
    ? Math.round((confirmedAppointments / appointments.length) * 100)
    : 0;

  const quickStats = [
    { label: 'Pacientes Ativos', value: patients.length.toString(), icon: '👥', color: 'from-blue-500 to-blue-600', path: '/dashboard/therapist/patients' },
    { label: 'Agendamentos Hoje', value: appointmentsToday.length.toString(), icon: '📅', color: 'from-teal-500 to-teal-600', path: '/dashboard/therapist/schedule' },
    { label: 'Mensagens', value: unreadMessages.toString(), icon: '💬', color: 'from-purple-500 to-purple-600', path: '/dashboard/therapist/messages', highlight: unreadMessages > 0 },
    { label: 'Taxa Confirmação', value: `${confirmationRate}%`, icon: '✓', color: 'from-green-500 to-green-600', path: '/dashboard/therapist/schedule' },
  ];

  const recentConversations = conversations.slice(0, 3);
  const upcomingAppointments = appointmentsNextWeek.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 text-white">
        <h1 className="text-4xl font-bold">Bem-vindo, {user?.name}! 👋</h1>
        <p className="text-slate-300 mt-2">Aqui está o resumo do seu dia e próximas atividades</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer text-white group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">{stat.icon}</div>
              {stat.highlight && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  Novo
                </span>
              )}
            </div>
            <p className="text-slate-100 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-2 group-hover:scale-110 transition-transform">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agendamentos de Hoje */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">📅 Agendamentos de Hoje</h2>
            <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full">
              {appointmentsToday.length} sessão{appointmentsToday.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-3">
            {appointmentsToday.length > 0 ? (
              appointmentsToday.map((apt) => (
                <div key={apt.id} className="border-l-4 border-teal-600 pl-4 py-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {apt.patient?.name || 'Paciente'}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        ⏰ {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(apt.end_time).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {apt.status === 'pending' && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        Pendente
                      </span>
                    )}
                    {apt.status === 'confirmed' && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        Confirmado
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="border-l-4 border-slate-300 pl-4 py-3 bg-slate-50 rounded">
                <p className="font-semibold text-slate-900">Nenhum agendamento hoje</p>
                <p className="text-sm text-slate-600 mt-1">Sua agenda está livre para o dia</p>
              </div>
            )}
          </div>
          <Link
            to="/dashboard/therapist/schedule"
            className="mt-4 inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            Ver agenda completa →
          </Link>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-600">
          <h2 className="text-xl font-bold text-slate-900 mb-4">⚡ Ações Rápidas</h2>
          <div className="space-y-3">
            <Link
              to="/dashboard/therapist/schedule"
              className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 rounded-lg text-center transition-all transform hover:scale-105"
            >
              📅 Ver Agenda
            </Link>
            <Link
              to="/dashboard/therapist/messages"
              className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg text-center transition-all transform hover:scale-105"
            >
              💬 Mensagens {unreadMessages > 0 && `(${unreadMessages})`}
            </Link>
            <Link
              to="/dashboard/therapist/documents"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg text-center transition-all transform hover:scale-105"
            >
              📄 Emitir Documento
            </Link>
            <Link
              to="/dashboard/therapist/patients"
              className="block w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg text-center transition-all transform hover:scale-105"
            >
              👥 Meus Pacientes
            </Link>
          </div>
        </div>
      </div>

      {/* Próximas Sessões e Últimas Conversas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Sessões */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">📆 Próximas Sessões</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {appointmentsNextWeek.length} próximas
            </span>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="border-l-4 border-blue-600 pl-4 py-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                  <p className="font-semibold text-slate-900 text-sm">
                    {apt.patient?.name || 'Paciente'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {new Date(apt.start_time).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-sm">Nenhuma sessão agendada para os próximos 7 dias</p>
            )}
          </div>
        </div>

        {/* Últimas Conversas */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">💬 Últimas Conversas</h2>
            <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
              {conversations.length} conversas
            </span>
          </div>
          <div className="space-y-3">
            {recentConversations.length > 0 ? (
              recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  to="/dashboard/therapist/messages"
                  className="block border-l-4 border-purple-600 pl-4 py-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">
                        {conv.other_user_name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 truncate">
                        {conv.last_message}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-slate-600 text-sm">Nenhuma conversa ainda</p>
            )}
          </div>
        </div>
      </div>

      {/* Documentos e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📋 Documentos Criados</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center border border-red-200">
              <p className="text-2xl font-bold text-red-600">{documentsByType.report}</p>
              <p className="text-xs text-red-700 mt-1 font-semibold">Relatórios</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-600">{documentsByType.diagnosis}</p>
              <p className="text-xs text-yellow-700 mt-1 font-semibold">Diagnósticos</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{documentsByType.progress_note}</p>
              <p className="text-xs text-blue-700 mt-1 font-semibold">Anotações</p>
            </div>
          </div>
          <Link
            to="/dashboard/therapist/documents"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            Ver todos os documentos →
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-600">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📊 Estatísticas</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-slate-700">Taxa de Confirmação</p>
                <p className="text-sm font-bold text-slate-900">{confirmationRate}%</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                {/* Dynamic width requires inline style - Tailwind cannot generate dynamic classes */}
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${confirmationRate}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-xs text-yellow-700 font-semibold">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingAppointments}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 font-semibold">Confirmados</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{confirmedAppointments}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
