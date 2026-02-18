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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
            Bem-vindo, {user.name}! 👋
          </h1>
          <p className="text-teal-100 max-w-2xl text-lg opacity-90">
            Este é seu espaço seguro. Gerencie seus agendamentos, mensagens e acompanhe sua evolução.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/10 blur-2xl"></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.path}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-teal-500/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10`}>
                  <IconComponent size={24} className={stat.color.split(' ')[1]} />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-white via-slate-100 to-white opacity-0 transition-opacity group-hover:opacity-100 h-1 bg-teal-500"></div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="text-teal-600" size={24} />
              Próximos Agendamentos
            </h2>
            <Link
              to="/dashboard/patient/appointments"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="space-y-4">
            {appointmentsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-3"></div>
                <p className="text-slate-500 font-medium">Carregando agendamentos...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="relative overflow-hidden group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-200 transition-all duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500 rounded-l-2xl"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-800">
                          Sessão com {apt.therapist?.name || 'Terapeuta'}
                        </h3>
                        {apt.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                            Pendente
                          </span>
                        )}
                        {apt.status === 'confirmed' && (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            Confirmado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(apt.start_time).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          ⏰ {new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/patient/appointments`}
                      className="self-start sm:self-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Detalhes
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Calendar className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Nenhum agendamento</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-xs">Você não tem sessões agendadas para os próximos dias.</p>
                <Link
                  to="/dashboard/patient/appointments"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-600/20 transition-all hover:scale-105"
                >
                  Agendar Sessão
                </Link>
              </div>
            )}
          </div>

          {/* Messages Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={24} />
                Mensagens Recentes
              </h2>
              <Link
                to="/dashboard/patient/messages"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messagesLoading ? (
                <div className="col-span-full py-8 text-center text-slate-500">Carregando mensagens...</div>
              ) : conversations.length > 0 ? (
                conversations.slice(0, 4).map((conv) => (
                  <Link
                    key={conv.other_user_id}
                    to="/dashboard/patient/messages"
                    className="group bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{conv.other_user_name}</span>
                      {conv.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{conv.last_message || 'Inicie uma conversa'}</p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 text-sm">Nenhuma conversa recente.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="text-amber-500" size={24} />
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Link
              to="/dashboard/patient/appointments"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-500 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Plus size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Novo Agendamento</h3>
                <p className="text-xs text-slate-500">Marque sua próxima sessão</p>
              </div>
            </Link>

            <Link
              to="/dashboard/patient/messages"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Send size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Enviar Mensagem</h3>
                <p className="text-xs text-slate-500">Fale com seu terapeuta</p>
              </div>
            </Link>

            <Link
              to="/dashboard/patient/reports"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-500 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Meus Relatórios</h3>
                <p className="text-xs text-slate-500">Acesse seus documentos</p>
              </div>
            </Link>

            {user?.tdah_screening_enabled && (
              <Link
                to="/dashboard/patient/tdah-screening"
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-500 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Triagem TDAH</h3>
                  <p className="text-xs text-slate-500">Faça sua avaliação</p>
                </div>
              </Link>
            )}

            <Link
              to="/dashboard/patient/test-shop"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-pink-500 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Loja de Testes</h3>
                <p className="text-xs text-slate-500">Adquira novos testes</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
