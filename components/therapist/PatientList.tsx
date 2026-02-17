import React, { useState, useMemo } from 'react';
import { usePatients } from '../../hooks/usePatients';
import { useAppointments } from '../../hooks/useAppointments';
import { PatientDetail } from './PatientDetail';
import { Search, Filter, Eye, Users } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  status?: 'active' | 'inactive' | 'paused';
  created_at: string;
  tdah_screening_enabled?: boolean;
  tdah_screening_paid?: boolean;
}

type ViewMode = 'table' | 'cards';
type SortBy = 'name' | 'lastSession' | 'nextSession';
type FilterStatus = 'all' | 'active' | 'inactive' | 'paused';

export const PatientList: React.FC = () => {
  const { patients: realPatients, loading, error } = usePatients();
  const { appointments } = useAppointments();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Converter dados reais para o formato esperado
  const patients = realPatients.map(p => ({
    id: p.id,
    name: p.name,
    phone: p.phone,
    email: p.email,
    status: 'active' as const,
    created_at: p.created_at,
    tdah_screening_enabled: p.tdah_screening_enabled,
    tdah_screening_paid: p.tdah_screening_paid,
  }));

  // Filtrar e ordenar pacientes
  const filteredAndSortedPatients = useMemo(() => {
    let result = patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    // Ordenar
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'lastSession') {
        const aLastSession = appointments
          .filter(apt => apt.patient_id === a.id && new Date(apt.start_time) <= new Date())
          .sort((x, y) => new Date(y.start_time).getTime() - new Date(x.start_time).getTime())[0];

        const bLastSession = appointments
          .filter(apt => apt.patient_id === b.id && new Date(apt.start_time) <= new Date())
          .sort((x, y) => new Date(y.start_time).getTime() - new Date(x.start_time).getTime())[0];

        const aDate = aLastSession ? new Date(aLastSession.start_time).getTime() : 0;
        const bDate = bLastSession ? new Date(bLastSession.start_time).getTime() : 0;
        return bDate - aDate;
      } else if (sortBy === 'nextSession') {
        const aNextSession = appointments
          .filter(apt => apt.patient_id === a.id && new Date(apt.start_time) > new Date())
          .sort((x, y) => new Date(x.start_time).getTime() - new Date(y.start_time).getTime())[0];

        const bNextSession = appointments
          .filter(apt => apt.patient_id === b.id && new Date(apt.start_time) > new Date())
          .sort((x, y) => new Date(x.start_time).getTime() - new Date(y.start_time).getTime())[0];

        const aDate = aNextSession ? new Date(aNextSession.start_time).getTime() : Infinity;
        const bDate = bNextSession ? new Date(bNextSession.start_time).getTime() : Infinity;
        return aDate - bDate;
      }

      return 0;
    });

    return result;
  }, [patients, searchTerm, filterStatus, sortBy, appointments]);

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

  const getLastSession = (patientId: string) => {
    const lastApt = appointments
      .filter(apt => apt.patient_id === patientId && new Date(apt.start_time) <= new Date())
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())[0];

    return lastApt ? new Date(lastApt.start_time).toLocaleDateString('pt-BR') : 'Nunca';
  };

  const getNextSession = (patientId: string) => {
    const nextApt = appointments
      .filter(apt => apt.patient_id === patientId && new Date(apt.start_time) > new Date())
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

    return nextApt ? new Date(nextApt.start_time).toLocaleDateString('pt-BR') : 'Sem agendamento';
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-teal-600" size={32} />
            Meus Pacientes
          </h1>
          <p className="text-slate-600 mt-1">{filteredAndSortedPatients.length} paciente(s)</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Search and View Mode */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${viewMode === 'table'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              Tabela
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${viewMode === 'cards'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Filter size={16} className="inline mr-2" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="paused">Em Pausa</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="name">Nome (A-Z)</option>
              <option value="lastSession">Última Sessão</option>
              <option value="nextSession">Próxima Sessão</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedPatients.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <Users className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-600 text-lg font-semibold">Nenhum paciente encontrado</p>
          <p className="text-slate-500 text-sm mt-2">
            {searchTerm
              ? 'Tente ajustar seus filtros de busca'
              : 'Quando pacientes se cadastrarem e forem associados a você, aparecerão aqui'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        // TABLE VIEW
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Telefone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Última Sessão</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Próxima Sessão</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAndSortedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.phone}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{getLastSession(patient.id)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{getNextSession(patient.id)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(patient.status || 'active')}`}>
                        {getStatusLabel(patient.status || 'active')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                        title="Ver detalhes do paciente"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // CARDS VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-slate-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4">
                <h3 className="text-lg font-bold">{patient.name}</h3>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Email</p>
                  <p className="text-sm text-slate-900">{patient.email}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 font-semibold">Telefone</p>
                  <p className="text-sm text-slate-900">{patient.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Última Sessão</p>
                    <p className="text-sm text-slate-900">{getLastSession(patient.id)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Próxima Sessão</p>
                    <p className="text-sm text-slate-900">{getNextSession(patient.id)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status || 'active')}`}>
                    {getStatusLabel(patient.status || 'active')}
                  </span>
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                    title="Ver detalhes do paciente"
                  >
                    <Eye size={16} />
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetail
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};
