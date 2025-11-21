import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const PatientDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Mostrar loading enquanto carrega
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando dashboard...</p>
      </div>
    );
  }

  const quickStats = [
    { label: 'Agendamentos', value: '3', icon: '📅', path: '/dashboard/appointments' },
    { label: 'Mensagens', value: '2', icon: '💬', path: '/dashboard/messages' },
    { label: 'Relatórios', value: '5', icon: '📄', path: '/dashboard/reports' },
    { label: 'Próxima Sessão', value: 'Hoje', icon: '⏰', path: '/dashboard/appointments' },
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
            <div className="border-l-4 border-teal-600 pl-4 py-2">
              <p className="font-semibold text-slate-900">Sessão com Terapeuta A</p>
              <p className="text-sm text-slate-600">Hoje às 14:00</p>
            </div>
            <div className="border-l-4 border-teal-600 pl-4 py-2">
              <p className="font-semibold text-slate-900">Sessão com Terapeuta A</p>
              <p className="text-sm text-slate-600">Amanhã às 10:00</p>
            </div>
            <div className="border-l-4 border-slate-300 pl-4 py-2">
              <p className="font-semibold text-slate-900">Agendar nova sessão</p>
              <p className="text-sm text-slate-600">Clique para agendar</p>
            </div>
          </div>
          <Link
            to="/dashboard/appointments"
            className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            Ver todos os agendamentos →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link
              to="/dashboard/appointments"
              className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Novo Agendamento
            </Link>
            <Link
              to="/dashboard/messages"
              className="block w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Enviar Mensagem
            </Link>
            <Link
              to="/dashboard/reports"
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
