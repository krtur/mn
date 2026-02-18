import React, { useState, useEffect } from 'react';
import { Calendar, CalendarEvent } from '../calendar/Calendar';
import { useAppointments } from '../../hooks/useAppointments';
import { useTherapistAvailability } from '../../hooks/useTherapistAvailability';
import { useAppointmentRecurrences } from '../../hooks/useAppointmentRecurrences';
import { useAppointmentRequests } from '../../hooks/useAppointmentRequests';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabase';
import { useLocation } from 'react-router-dom';
import { TherapistSchedule } from './TherapistSchedule';

interface NewAppointment {
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  recurrence: 'none' | 'weekly' | 'biweekly' | 'monthly';
  recurrenceEndDate?: string;
}

export const ScheduleManager: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { appointments, loading: appointmentsLoading, updateAppointment, deleteAppointment } = useAppointments();
  const { availability, addAvailability, removeAvailability } = useTherapistAvailability();
  const { recurrences, createRecurrence, deleteRecurrence } = useAppointmentRecurrences();
  const { requests, approveRequest, rejectRequest, refetch } = useAppointmentRequests();

  // Extrair parâmetros da query string
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const actionParam = queryParams.get('action');

  // Definir aba ativa com base no parâmetro da URL
  const [activeTab, setActiveTab] = useState<'calendar' | 'availability' | 'requests'>(tabParam === 'requests' ? 'requests' : 'calendar');
  const [showNewAppointment, setShowNewAppointment] = useState(actionParam === 'new');
  const [showNewAvailability, setShowNewAvailability] = useState(false);
  const [showEditAppointment, setShowEditAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Atualizar estado quando os parâmetros da URL mudarem
  useEffect(() => {
    if (tabParam === 'requests') {
      setActiveTab('requests');
    }

    if (actionParam === 'new') {
      setShowNewAppointment(true);
      setActiveTab('calendar');
    }
  }, [tabParam, actionParam]);

  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    patientId: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    recurrence: 'none'
  });

  const [newAvailability, setNewAvailability] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00'
  });

  // Buscar pacientes do terapeuta
  React.useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      setLoadingPatients(true);
      try {
        // Primeiro, tentar buscar pacientes que já têm agendamentos
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('patient_id, patient:patient_id(id, name, email)')
          .eq('therapist_id', user.id)
          .not('patient_id', 'is', null);

        if (appointmentError) throw appointmentError;

        // Remover duplicatas dos agendamentos
        const patientsFromAppointments = Array.from(
          new Map(appointmentData?.map(item => [item.patient_id, item.patient]) || []).values()
        );

        // Também buscar pacientes da tabela users que têm role 'patient'
        const { data: allPatients, error: patientsError } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('role', 'patient');

        if (patientsError) throw patientsError;

        // Combinar e remover duplicatas
        const allPatientsMap = new Map<string, any>();

        // Adicionar pacientes dos agendamentos
        patientsFromAppointments.forEach((p: any) => {
          if (p && p.id) allPatientsMap.set(p.id, p);
        });

        // Adicionar pacientes da tabela users
        allPatients?.forEach((p: any) => {
          if (p && p.id && !allPatientsMap.has(p.id)) {
            allPatientsMap.set(p.id, p);
          }
        });

        setPatients(Array.from(allPatientsMap.values()));
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [user, appointments]);

  // Buscar nomes dos pacientes para os agendamentos
  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Paciente';
  };

  // Converter agendamentos para eventos do calendário
  const calendarEvents: CalendarEvent[] = appointments.map(apt => ({
    id: apt.id,
    title: `Sessão com ${getPatientName(apt.patient_id)}`,
    start: new Date(apt.start_time),
    end: new Date(apt.end_time),
    status: apt.status as any,
    color: apt.status === 'confirmed' ? 'green' : apt.status === 'pending' ? 'yellow' : 'slate'
  }));

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !newAppointment.patientId || !newAppointment.date) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const startTime = `${newAppointment.date}T${newAppointment.startTime}:00`;
      const endTime = `${newAppointment.date}T${newAppointment.endTime}:00`;

      if (newAppointment.recurrence === 'none') {
        // Criar agendamento único
        const { error } = await supabase
          .from('appointments')
          .insert([
            {
              patient_id: newAppointment.patientId,
              therapist_id: user.id,
              start_time: startTime,
              end_time: endTime,
              status: 'confirmed'
            }
          ]);

        if (error) throw error;
      } else {
        // Criar recorrência
        const [year, month, day] = newAppointment.date.split('-');
        const dayOfWeek = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getDay();

        await createRecurrence(
          newAppointment.patientId,
          newAppointment.date,
          newAppointment.recurrenceEndDate || null,
          newAppointment.recurrence as 'weekly' | 'biweekly' | 'monthly',
          dayOfWeek,
          null,
          newAppointment.startTime,
          newAppointment.endTime
        );
      }

      setShowNewAppointment(false);
      setNewAppointment({
        patientId: '',
        date: '',
        startTime: '09:00',
        endTime: '10:00',
        recurrence: 'none'
      });

      // Aguardar um pouco e recarregar os agendamentos
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      alert('Agendamento criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      alert('Erro ao criar agendamento');
    }
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addAvailability(
        newAvailability.dayOfWeek,
        newAvailability.startTime,
        newAvailability.endTime
      );

      setShowNewAvailability(false);
      setNewAvailability({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00'
      });

      alert('Horário de atendimento adicionado!');
    } catch (err) {
      console.error('Erro ao adicionar horário:', err);
      alert('Erro ao adicionar horário');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveRequest(requestId);
      alert('Solicitação aprovada!');
      // Refazer busca após aprovar
      setTimeout(() => refetch(), 1000);
    } catch (err) {
      console.error('Erro ao aprovar:', err);
      alert('Erro ao aprovar solicitação');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      alert('Solicitação rejeitada!');
      // Refazer busca após rejeitar
      setTimeout(() => refetch(), 1000);
    } catch (err) {
      console.error('Erro ao rejeitar:', err);
      alert('Erro ao rejeitar solicitação');
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
  };

  const handleEventClick = (event: any) => {
    const appointment = appointments.find(a => a.id === event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setShowEditAppointment(true);
    }
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      // Extrair data e hora do agendamento selecionado
      const appointmentDate = selectedAppointment.date || new Date(selectedAppointment.start_time).toISOString().split('T')[0];
      const startTimeValue = selectedAppointment.startTime || new Date(selectedAppointment.start_time).toTimeString().slice(0, 5);
      const endTimeValue = selectedAppointment.endTime || new Date(selectedAppointment.end_time).toTimeString().slice(0, 5);

      // Montar timestamps corretos
      const startTime = `${appointmentDate}T${startTimeValue}:00`;
      const endTime = `${appointmentDate}T${endTimeValue}:00`;

      console.log('Atualizando agendamento:', {
        id: selectedAppointment.id,
        start_time: startTime,
        end_time: endTime,
        notes: selectedAppointment.notes
      });

      await updateAppointment(selectedAppointment.id, {
        start_time: startTime,
        end_time: endTime,
        notes: selectedAppointment.notes
      });

      setShowEditAppointment(false);
      setSelectedAppointment(null);
      alert('Agendamento atualizado com sucesso!');
      window.location.reload();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      alert('Erro ao atualizar agendamento');
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    if (!window.confirm('Tem certeza que deseja deletar este agendamento?')) return;

    try {
      await deleteAppointment(selectedAppointment.id);
      setShowEditAppointment(false);
      setSelectedAppointment(null);
      alert('Agendamento deletado com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar agendamento');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Gerenciador de Agenda</h1>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'calendar'
            ? 'text-teal-600 border-b-2 border-teal-600'
            : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          📅 Calendário
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'availability'
            ? 'text-teal-600 border-b-2 border-teal-600'
            : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          ⏰ Horários de Atendimento
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 font-semibold transition-colors relative ${activeTab === 'requests'
            ? 'text-teal-600 border-b-2 border-teal-600'
            : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          📬 Solicitações
          {pendingRequests.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowNewAppointment(!showNewAppointment)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              + Novo Agendamento
            </button>
          </div>

          {showNewAppointment && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Criar Novo Agendamento</h2>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paciente *</label>
                  <select
                    value={newAppointment.patientId}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Selecione um paciente</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data *</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recorrência</label>
                    <select
                      value={newAppointment.recurrence}
                      onChange={(e) => setNewAppointment({ ...newAppointment, recurrence: e.target.value as any })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="none">Sem recorrência</option>
                      <option value="weekly">Semanal</option>
                      <option value="biweekly">A cada 2 semanas</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Horário Início *</label>
                    <input
                      type="time"
                      value={newAppointment.startTime}
                      onChange={(e) => setNewAppointment({ ...newAppointment, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Horário Fim *</label>
                    <input
                      type="time"
                      value={newAppointment.endTime}
                      onChange={(e) => setNewAppointment({ ...newAppointment, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {newAppointment.recurrence !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data Final (opcional)</label>
                    <input
                      type="date"
                      value={newAppointment.recurrenceEndDate || ''}
                      onChange={(e) => setNewAppointment({ ...newAppointment, recurrenceEndDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Criar Agendamento
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

          {appointmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <Calendar
              events={calendarEvents}
              onDateSelect={setSelectedDate}
              onEventClick={handleEventClick}
              onCreateEvent={(date) => {
                setSelectedDate(date);
                setNewAppointment({
                  ...newAppointment,
                  date: date.toISOString().split('T')[0]
                });
                setShowNewAppointment(true);
              }}
            />
          )}
        </div>
      )}

      {activeTab === 'availability' && (
        <TherapistSchedule />
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-slate-50 rounded-lg p-6 text-center">
              <p className="text-slate-600">Nenhuma solicitação pendente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(request => {
                // Formatar data corretamente sem problemas de fuso horário
                const [year, month, day] = request.requested_date.split('-');
                const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('pt-BR');

                return (
                  <div key={request.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {request.patient?.name || 'Paciente'}
                        </h3>
                        <p className="text-sm text-slate-600">
                          📅 {formattedDate} às{' '}
                          {request.requested_time}
                        </p>
                        {request.reason && (
                          <p className="text-sm text-slate-500 mt-2">Motivo: {request.reason}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          ✕ Rejeitar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Edição de Agendamento */}
      {showEditAppointment && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Editar Agendamento</h2>
            <form onSubmit={handleUpdateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                <input
                  type="text"
                  value={selectedAppointment.patient?.name || 'Paciente'}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input
                  type="date"
                  value={selectedAppointment.date || new Date(selectedAppointment.start_time).toISOString().split('T')[0]}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora Início</label>
                  <input
                    type="time"
                    value={selectedAppointment.startTime || new Date(selectedAppointment.start_time).toTimeString().slice(0, 5)}
                    onChange={(e) => setSelectedAppointment({ ...selectedAppointment, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fim</label>
                  <input
                    type="time"
                    value={selectedAppointment.endTime || new Date(selectedAppointment.end_time).toTimeString().slice(0, 5)}
                    onChange={(e) => setSelectedAppointment({ ...selectedAppointment, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                <textarea
                  value={selectedAppointment.notes || ''}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAppointment}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Deletar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAppointment(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
