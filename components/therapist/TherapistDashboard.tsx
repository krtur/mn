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
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointmentsToday = appointments.filter((apt) => {
    const aptDate = new Date(apt.start_time);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime() && apt.status !== 'cancelled';
  });

  const unreadMessages = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  const pendingDocuments = documents.filter((doc) => doc.type === 'report' || doc.type === 'progress_note');

  const quickStats = [
    { label: 'Pacientes Ativos', value: patients.length.toString(), icon: '👥', path: '/dashboard/therapist/patients' },
    { label: 'Agendamentos Hoje', value: appointmentsToday.length.toString(), icon: '📅', path: '/dashboard/therapist/schedule' },
    { label: 'Mensagens', value: unreadMessages.toString(), icon: '💬', path: '/dashboard/therapist/messages' },
    { label: 'Documentos', value: documents.length.toString(), icon: '📄', path: '/dashboard/therapist/documents' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bem-vindo, {user?.name}!</h1>
        <p className="text-slate-600 mt-2">Dashboard de gerenciamento de pacientes e agenda.</p>
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
          <h2 className="text-xl font-bold text-slate-900 mb-4">Agendamentos de Hoje</h2>
          <div className="space-y-3">
            {appointmentsToday.length > 0 ? (
              appointmentsToday.map((apt) => (
                <div key={apt.id} className="border-l-4 border-teal-600 pl-4 py-2">
                  <p className="font-semibold text-slate-900">
                    {apt.patient?.name || 'Paciente'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(apt.end_time).toLocaleTimeString('pt-BR', {
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
                <p className="font-semibold text-slate-900">Nenhum agendamento hoje</p>
                <p className="text-sm text-slate-600">Sua agenda está livre</p>
              </div>
            )}
          </div>
          <Link
            to="/dashboard/therapist/schedule"
            className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            Ver agenda completa →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link
              to="/dashboard/therapist/schedule"
              className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Ver Agenda
            </Link>
            <Link
              to="/dashboard/therapist/messages"
              className="block w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Mensagens
            </Link>
            <Link
              to="/dashboard/therapist/documents"
              className="block w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Emitir Documento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
