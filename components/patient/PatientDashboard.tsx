import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useMessages } from '../../hooks/useMessages';
import { useDocuments } from '../../hooks/useDocuments';

export const PatientDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { conversations, loading: messagesLoading } = useMessages();
  const { documents, loading: documentsLoading } = useDocuments();
  
  // Mostrar loading enquanto carrega
  if (isLoading || !user || appointmentsLoading || messagesLoading || documentsLoading) {
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

  const quickStats = [
    { label: 'Agendamentos', value: appointments.length.toString(), icon: '📅', path: '/dashboard/patient/appointments' },
    { label: 'Mensagens', value: unreadMessages.toString(), icon: '💬', path: '/dashboard/patient/messages' },
    { label: 'Relatórios', value: documents.length.toString(), icon: '📄', path: '/dashboard/patient/reports' },
    { label: 'Próxima Sessão', value: nextAppointment ? 'Agendada' : 'Nenhuma', icon: '⏰', path: '/dashboard/patient/appointments' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bem-vindo, {user.name}!</h1>
        <p className="text-slate-600 mt-2">Aqui você pode gerenciar seus agendamentos, mensagens e documentos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-2">{stat.icon}</div>
            <p className="text-slate-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Próximos Agendamentos</h2>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="border-l-4 border-teal-600 pl-4 py-2">
                  <p className="font-semibold text-slate-900">
                    Sessão com {apt.therapist?.name || 'Terapeuta'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(apt.start_time).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {apt.status === 'pending' && (
                    <p className="text-xs text-yellow-600 mt-1">Pendente de confirmação</p>
                  )}
                </div>
              ))
            ) : (
              <div className="border-l-4 border-slate-300 pl-4 py-2">
                <p className="font-semibold text-slate-900">Nenhum agendamento próximo</p>
                <p className="text-sm text-slate-600">Clique abaixo para agendar uma sessão</p>
              </div>
            )}
          </div>
          <Link
            to="/dashboard/patient/appointments"
            className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            Ver todos os agendamentos →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link
              to="/dashboard/patient/appointments"
              className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Novo Agendamento
            </Link>
            <Link
              to="/dashboard/patient/messages"
              className="block w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Enviar Mensagem
            </Link>
            <Link
              to="/dashboard/patient/reports"
              className="block w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Meus Relatórios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
