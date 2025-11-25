import React, { useState, useEffect } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { useAppointmentRequests } from '../../hooks/useAppointmentRequests';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabase';
import { Calendar, CalendarEvent } from '../calendar/Calendar';

export const Appointments: React.FC = () => {
  const { user } = useAuth();
  const { appointments, loading, error, updateAppointment, deleteAppointment, refetch } = useAppointments();
  const { requests, createRequest, cancelRequest } = useAppointmentRequests();
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Debug log
  React.useEffect(() => {
    console.log('Appointments component - Dados do paciente:', {
      userId: user?.id,
      userRole: user?.role,
      appointmentsCount: appointments.length,
      appointments,
      loading,
      error
    });
  }, [appointments, user, loading, error]);
  const [newRequest, setNewRequest] = useState({
    therapistId: '',
    date: '',
    time: '09:00',
    reason: ''
  });

  // Buscar dados do terapeuta do paciente
  useEffect(() => {
    if (!user?.therapist_id) {
      console.log('❌ Paciente sem therapist_id');
      setLoadingTherapists(false);
      return;
    }

    let isMounted = true;

    const fetchTherapist = async () => {
      setLoadingTherapists(true);
      try {
        console.log('🔍 Buscando terapeuta:', user.therapist_id);
        
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('id', user.therapist_id)
          .single();

        if (error) {
          console.error('❌ Erro ao buscar terapeuta:', error);
          throw error;
        }
        
        console.log('✅ Terapeuta encontrado:', data);
        
        if (isMounted && data) {
          setTherapists([data]);
          // Pré-selecionar o terapeuta do paciente
          setNewRequest(prev => ({ ...prev, therapistId: data.id }));
        }
      } catch (err) {
        console.error('❌ Erro ao buscar terapeuta:', err);
        // Fallback: mostrar mensagem de erro
        if (isMounted) {
          setTherapists([]);
        }
      } finally {
        if (isMounted) {
          setLoadingTherapists(false);
        }
      }
    };

    fetchTherapist();

    return () => {
      isMounted = false;
    };
  }, [user?.therapist_id]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRequest.therapistId || !newRequest.date || !newRequest.time) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const result = await createRequest(
        newRequest.therapistId,
        newRequest.date,
        newRequest.time,
        newRequest.reason
      );

      console.log('✅ Solicitação criada:', result);

      setShowNewAppointment(false);
      setNewRequest({
        therapistId: '',
        date: '',
        time: '09:00',
        reason: ''
      });

      alert('Solicitação de agendamento enviada! O terapeuta analisará em breve.');
    } catch (err) {
      console.error('Erro ao criar solicitação:', err);
      alert('Erro ao criar solicitação');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (window.confirm('Deseja cancelar esta solicitação?')) {
      try {
        await cancelRequest(requestId);
        alert('Solicitação cancelada');
      } catch (err) {
        console.error('Erro ao cancelar:', err);
        alert('Erro ao cancelar solicitação');
      }
    }
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment({
      ...appointment,
      date: new Date(appointment.start_time).toISOString().split('T')[0],
      startTime: new Date(appointment.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(appointment.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    setShowEditModal(true);
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const startTime = `${selectedAppointment.date}T${selectedAppointment.startTime}:00`;
      const endTime = `${selectedAppointment.date}T${selectedAppointment.endTime}:00`;

      await updateAppointment(selectedAppointment.id, {
        start_time: startTime,
        end_time: endTime,
        notes: selectedAppointment.notes
      });

      setShowEditModal(false);
      setSelectedAppointment(null);
      
      // Refetch após atualizar
      setTimeout(() => {
        refetch();
      }, 500);
      
      alert('Agendamento atualizado com sucesso!');
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
      setShowEditModal(false);
      setSelectedAppointment(null);
      
      // Refetch após deletar
      setTimeout(() => {
        refetch();
      }, 500);
      
      alert('Agendamento deletado com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar agendamento');
    }
  };

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

  // Converter agendamentos para eventos do calendário
  const calendarEvents: CalendarEvent[] = appointments.map(apt => ({
    id: apt.id,
    title: `Sessão com ${apt.therapist?.name || 'Terapeuta'}`,
    start: new Date(apt.start_time),
    end: new Date(apt.end_time),
    status: apt.status as any,
    color: apt.status === 'confirmed' ? 'green' : apt.status === 'pending' ? 'yellow' : 'slate'
  }));

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
          <h2 className="text-xl font-bold text-slate-900 mb-4">Solicitar Novo Agendamento</h2>
          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Terapeuta</label>
              <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50">
                {loadingTherapists ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                    <p className="text-slate-600 text-sm">Carregando terapeuta...</p>
                  </div>
                ) : therapists.length > 0 ? (
                  <>
                    <p className="text-slate-900 font-medium">{therapists[0].name}</p>
                    <p className="text-sm text-slate-600">{therapists[0].email}</p>
                  </>
                ) : (
                  <p className="text-red-600 text-sm">❌ Erro ao carregar terapeuta</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data *</label>
                <input
                  type="date"
                  value={newRequest.date}
                  onChange={(e) => setNewRequest({ ...newRequest, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horário *</label>
                <input
                  type="time"
                  value={newRequest.time}
                  onChange={(e) => setNewRequest({ ...newRequest, time: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Motivo (opcional)</label>
              <textarea
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                placeholder="Descreva o motivo da consulta..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loadingTherapists || !newRequest.therapistId || !newRequest.date || !newRequest.time}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Enviar Solicitação
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
          <div className="bg-white rounded-lg shadow p-6">
            <Calendar 
              events={calendarEvents}
              onEventClick={(event) => {
                const appointment = appointments.find(a => a.id === event.id);
                if (appointment) {
                  handleEditAppointment(appointment);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Solicitações Pendentes */}
      {requests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Minhas Solicitações</h2>
          <div className="space-y-3">
            {requests.map((request) => {
              // Formatar data corretamente sem problemas de fuso horário
              const [year, month, day] = request.requested_date.split('-');
              const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('pt-BR');
              
              return (
              <div key={request.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {request.therapist?.name || 'Terapeuta'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      📅 {formattedDate} às{' '}
                      {request.requested_time}
                    </p>
                    {request.reason && (
                      <p className="text-sm text-slate-500 mt-2">Motivo: {request.reason}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {request.status === 'pending' ? '⏳ Pendente' :
                       request.status === 'approved' ? '✓ Aprovada' :
                       request.status === 'rejected' ? '✕ Rejeitada' :
                       'Cancelada'}
                    </span>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-semibold"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      )}

      {/* Modal de Edição de Agendamento */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Editar Agendamento</h2>
            <form onSubmit={handleUpdateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Terapeuta</label>
                <input
                  type="text"
                  value={selectedAppointment.therapist?.name || 'Terapeuta'}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input
                  type="date"
                  value={selectedAppointment.date}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora Início</label>
                  <input
                    type="time"
                    value={selectedAppointment.startTime}
                    onChange={(e) => setSelectedAppointment({ ...selectedAppointment, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fim</label>
                  <input
                    type="time"
                    value={selectedAppointment.endTime}
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
                    setShowEditModal(false);
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
