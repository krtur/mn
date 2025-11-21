import React, { useState } from 'react';

interface ScheduleItem {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export const Schedule: React.FC = () => {
  const [schedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      patientName: 'João Silva',
      date: '2024-11-20',
      time: '14:00',
      status: 'confirmed',
    },
    {
      id: '2',
      patientName: 'Maria Santos',
      date: '2024-11-20',
      time: '15:00',
      status: 'confirmed',
    },
    {
      id: '3',
      patientName: 'Pedro Costa',
      date: '2024-11-20',
      time: '16:00',
      status: 'pending',
    },
    {
      id: '4',
      patientName: 'Ana Silva',
      date: '2024-11-21',
      time: '10:00',
      status: 'confirmed',
    },
  ]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Agenda</h1>

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
    </div>
  );
};
