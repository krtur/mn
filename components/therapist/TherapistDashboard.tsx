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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              Painel do Terapeuta
            </h1>
            <p className="text-slate-400 text-lg">
              Bem-vindo, {user?.name}. Aqui está o panorama do seu dia.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="px-4 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 font-medium text-sm">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-teal-900/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-60 w-60 rounded-full bg-blue-900/20 blur-3xl"></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-teal-500/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 truncate">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                  {stat.highlight && (
                    <span className="flex h-2.5 w-2.5 rounded-full bg-red-500">
                      <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75"></span>
                    </span>
                  )}
                </div>
              </div>
              <div className={`rounded-xl p-3 text-2xl bg-slate-50 group-hover:bg-slate-100 transition-colors`}>
                {stat.icon}
              </div>
            </div>

            {/* Progress bar for confirmation rate */}
            {stat.label.includes('Taxa') && (
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: stat.value }}
                ></div>
              </div>
            )}

            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 transition-opacity group-hover:opacity-100`}></div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Appointments Today */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              📅 Agendamentos de Hoje
            </h2>
            <Link
              to="/dashboard/therapist/schedule"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              Ver agenda completa
            </Link>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
            {appointmentsToday.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {appointmentsToday.map((apt) => (
                  <div key={apt.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-teal-50 flex flex-col items-center justify-center text-teal-700 border border-teal-100">
                        <span className="text-xs font-bold uppercase">{new Date(apt.start_time).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                        <span className="text-lg font-bold">{new Date(apt.start_time).getDate()}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{apt.patient?.name || 'Paciente'}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            ⏰ {new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {apt.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">
                          Pendente
                        </span>
                      )}
                      {apt.status === 'confirmed' && (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                          Confirmado
                        </span>
                      )}
                      <Link
                        to={`/dashboard/therapist/schedule?date=${new Date(apt.start_time).toISOString().split('T')[0]}`}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Ver na agenda"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">☕</span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Dia livre!</h3>
                <p className="text-slate-500 mt-1">Nenhum agendamento para hoje.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats Cards: Documents */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                📋 Documentos Emitidos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-sm font-medium text-slate-600">Relatórios</span>
                  <span className="font-bold text-slate-900">{documentsByType.report}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-sm font-medium text-slate-600">Diagnósticos</span>
                  <span className="font-bold text-slate-900">{documentsByType.diagnosis}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-sm font-medium text-slate-600">Anotações</span>
                  <span className="font-bold text-slate-900">{documentsByType.progress_note}</span>
                </div>
              </div>
              <Link
                to="/dashboard/therapist/documents"
                className="mt-4 block text-center w-full py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                Gerenciar Documentos
              </Link>
            </div>

            {/* Stats Cards: Próximas Sessões */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                📅 Próximos 7 Dias
              </h3>
              <div className="space-y-3">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="w-1.5 h-10 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {apt.patient?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(apt.start_time).toLocaleDateString('pt-BR', { weekday: 'short' })}, {new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Sem agendamentos próximos.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Messages */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              ⚡ Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/dashboard/therapist/schedule?action=new"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-slate-600 hover:text-teal-600 font-medium"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 text-teal-600">📅</span>
                Novo Agendamento
              </Link>
              <Link
                to="/dashboard/therapist/patient-registration"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-slate-600 hover:text-blue-600 font-medium"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">👥</span>
                Cadastrar Paciente
              </Link>
              <Link
                to="/dashboard/therapist/documents"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-slate-600 hover:text-purple-600 font-medium"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600">📄</span>
                Emitir Documento
              </Link>
              <Link
                to="/dashboard/therapist/messages"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-slate-600 hover:text-green-600 font-medium"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600">💬</span>
                Enviar Mensagem
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                💬 Mensagens
              </h3>
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadMessages} novas
                </span>
              )}
            </div>
            <div className="space-y-2">
              {recentConversations.length > 0 ? (
                recentConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to="/dashboard/therapist/messages"
                    className="block p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-slate-900 text-sm">{conv.other_user_name}</p>
                      {conv.unread_count > 0 && <div className="w-2 h-2 rounded-full bg-red-500 mt-1"></div>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{conv.last_message}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Nenhuma mensagem recente.</p>
              )}
            </div>
            <Link
              to="/dashboard/therapist/messages"
              className="mt-4 block text-center w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Ver todas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
