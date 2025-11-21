import React, { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  status?: 'active' | 'inactive' | 'paused';
  lastSession?: string;
}

export const PatientList: React.FC = () => {
  const { patients: realPatients, loading, error } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');

  // Converter dados reais para o formato esperado
  const patients = realPatients.map(p => ({
    id: p.id,
    name: p.name,
    cpf: p.cpf,
    phone: p.phone,
    email: p.email,
    status: 'active' as const,
    lastSession: undefined,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'paused':
        return 'Em Pausa';
      default:
        return status;
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
  );

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-slate-600">Carregando pacientes...</p>
      </div>
    );
  }

  // Mostrar erro
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Erro ao carregar pacientes: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Meus Pacientes</h1>

      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 text-lg">Nenhum paciente encontrado</p>
          <p className="text-slate-500 text-sm mt-2">Quando pacientes se cadastrarem e forem associados a você, aparecerão aqui</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">CPF</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Telefone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.cpf}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.phone}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(patient.status || 'active')}`}>
                        {getStatusLabel(patient.status || 'active')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-teal-600 hover:text-teal-700 font-semibold mr-3">Ver</button>
                      <button className="text-slate-600 hover:text-slate-900 font-semibold">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
