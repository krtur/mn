import React from 'react';

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  therapist: string;
}

export const Reports: React.FC = () => {
  const [reports] = React.useState<Report[]>([
    {
      id: '1',
      title: 'Relatório de Progresso - Novembro',
      type: 'Relatório',
      date: '2024-11-15',
      therapist: 'Terapeuta A',
    },
    {
      id: '2',
      title: 'Diagnóstico Inicial',
      type: 'Diagnóstico',
      date: '2024-10-01',
      therapist: 'Terapeuta A',
    },
    {
      id: '3',
      title: 'Notas de Progresso - Outubro',
      type: 'Notas',
      date: '2024-10-30',
      therapist: 'Terapeuta A',
    },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Meus Relatórios</h1>

      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{report.title}</h3>
                <p className="text-sm text-slate-600">
                  {report.type} • {report.therapist} • {new Date(report.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">👁️ Visualizar</button>
                <button className="text-slate-600 hover:text-slate-900 font-semibold text-sm">⬇️ Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
