import React, { useState } from 'react';
import { useAppointments } from '../../hooks/useAppointments';

export const Appointments: React.FC = () => {
  const { appointments, loading, error } = useAppointments();
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando agendamentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Erro ao carregar agendamentos</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Agendamentos</h1>
        <button
          onClick={() => setShowNewAppointment(!showNewAppointment)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          + Novo Agendamento
        </button>
      </div>

      {showNewAppointment && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Agendar Nova Sessão</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Terapeuta</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Selecione um terapeuta</option>
                <option>Terapeuta A</option>
                <option>Terapeuta B</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Agendar
              </button>
              <button
                type="button"
                onClick={() => setShowNewAppointment(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Próximos Agendamentos</h2>
        {appointments.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-6 text-center">
            <p className="text-slate-600">Você não possui agendamentos no momento</p>
            <button
              onClick={() => setShowNewAppointment(true)}
              className="mt-4 text-teal-600 hover:text-teal-700 font-semibold"
            >
              Agendar uma sessão
            </button>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    Sessão com {apt.therapist?.name || 'Terapeuta'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    📅 {new Date(apt.start_time).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {apt.notes && <p className="text-sm text-slate-500 mt-2">Notas: {apt.notes}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                  {getStatusLabel(apt.status)}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-sm text-teal-600 hover:text-teal-700 font-semibold">Reagendar</button>
                <button className="text-sm text-red-600 hover:text-red-700 font-semibold">Cancelar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
