import React from 'react';

interface Attendance {
  id: string;
  date: string;
  therapist: string;
  duration: number;
  notes?: string;
}

export const AttendanceHistory: React.FC = () => {
  const [attendances] = React.useState<Attendance[]>([
    {
      id: '1',
      date: '2024-11-13',
      therapist: 'Terapeuta A',
      duration: 50,
      notes: 'Sessão focada em técnicas de relaxamento',
    },
    {
      id: '2',
      date: '2024-11-06',
      therapist: 'Terapeuta A',
      duration: 50,
      notes: 'Discussão sobre objetivos terapêuticos',
    },
    {
      id: '3',
      date: '2024-10-30',
      therapist: 'Terapeuta A',
      duration: 50,
      notes: 'Primeira sessão - Avaliação inicial',
    },
  ]);

  const totalSessions = attendances.length;
  const totalHours = (attendances.reduce((sum, att) => sum + att.duration, 0) / 60).toFixed(1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Histórico de Atendimentos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Total de Sessões</p>
          <p className="text-3xl font-bold text-teal-600">{totalSessions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Horas de Atendimento</p>
          <p className="text-3xl font-bold text-teal-600">{totalHours}h</p>
        </div>
      </div>

      <div className="space-y-3">
        {attendances.map((att) => (
          <div key={att.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{att.therapist}</h3>
                <p className="text-sm text-slate-600">
                  📅 {new Date(att.date).toLocaleDateString('pt-BR')} • ⏱️ {att.duration} minutos
                </p>
                {att.notes && <p className="text-sm text-slate-700 mt-2 italic">{att.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
