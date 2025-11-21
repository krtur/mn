import React, { useState } from 'react';

interface Appointment {
  id: string;
  therapist: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const Appointments: React.FC = () => {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      therapist: 'Terapeuta A',
      date: '2024-11-20',
      time: '14:00',
      status: 'confirmed',
    },
    {
      id: '2',
      therapist: 'Terapeuta A',
      date: '2024-11-27',
      time: '10:00',
      status: 'confirmed',
    },
    {
      id: '3',
      therapist: 'Terapeuta B',
      date: '2024-12-04',
      time: '15:30',
      status: 'pending',
    },
  ]);

  const [showNewAppointment, setShowNewAppointment] = useState(false);

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
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{apt.therapist}</h3>
                <p className="text-sm text-slate-600">
                  📅 {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time}
                </p>
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
        ))}
      </div>
    </div>
  );
};
