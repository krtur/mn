import React from 'react';
import { useAppointments } from '../../hooks/useAppointments';

interface ScheduleItem {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export const Schedule: React.FC = () => {
  const { appointments, loading, error } = useAppointments();

  // Converter agendamentos reais para o formato esperado
  const schedule: ScheduleItem[] = appointments.map(apt => ({
    id: apt.id,
    patientName: apt.patient?.name || 'Paciente',
    date: apt.start_time.split('T')[0],
    time: apt.start_time.split('T')[1]?.substring(0, 5) || '00:00',
    status: (apt.status as 'confirmed' | 'pending' | 'completed') || 'pending',
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando agenda...</p>
      </div>
    );
  }

  // Mostrar erro
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Erro ao carregar agenda: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Agenda</h1>

      {schedule.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 text-lg">Nenhum agendamento</p>
          <p className="text-slate-500 text-sm mt-2">Quando pacientes agendarem sessões, aparecerão aqui</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Próximas Sessões</h2>
          </div>

          <div className="divide-y divide-slate-200">
            {schedule.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.patientName}</h3>
                    <p className="text-sm text-slate-600">
                      📅 {new Date(item.date).toLocaleDateString('pt-BR')} às {item.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-sm text-teal-600 hover:text-teal-700 font-semibold">Confirmar</button>
                  <button className="text-sm text-slate-600 hover:text-slate-900 font-semibold">Reagendar</button>
                  <button className="text-sm text-red-600 hover:text-red-700 font-semibold">Cancelar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
