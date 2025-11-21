import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const TherapistDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Pacientes Ativos', value: '8', icon: '👥', path: '/dashboard/patients' },
    { label: 'Agendamentos Hoje', value: '3', icon: '📅', path: '/dashboard/schedule' },
    { label: 'Mensagens', value: '5', icon: '💬', path: '/dashboard/messages' },
    { label: 'Documentos Pendentes', value: '2', icon: '📄', path: '/dashboard/documents' },
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
            <div className="border-l-4 border-teal-600 pl-4 py-2">
              <p className="font-semibold text-slate-900">João Silva</p>
              <p className="text-sm text-slate-600">14:00 - 14:50</p>
            </div>
            <div className="border-l-4 border-teal-600 pl-4 py-2">
              <p className="font-semibold text-slate-900">Maria Santos</p>
              <p className="text-sm text-slate-600">15:00 - 15:50</p>
            </div>
            <div className="border-l-4 border-teal-600 pl-4 py-2">
              <p className="font-semibold text-slate-900">Pedro Costa</p>
              <p className="text-sm text-slate-600">16:00 - 16:50</p>
            </div>
          </div>
          <Link
            to="/dashboard/schedule"
            className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            Ver agenda completa →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link
              to="/dashboard/schedule"
              className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Ver Agenda
            </Link>
            <Link
              to="/dashboard/messages"
              className="block w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Mensagens
            </Link>
            <Link
              to="/dashboard/documents"
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
