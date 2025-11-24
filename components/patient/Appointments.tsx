import React, { useState, useEffect } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { useAppointmentRequests } from '../../hooks/useAppointmentRequests';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabase';

export const Appointments: React.FC = () => {
  const { user } = useAuth();
  const { appointments, loading, error } = useAppointments();
  const { requests, createRequest, cancelRequest } = useAppointmentRequests();
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loadingTherapists, setLoadingTherapists] = useState(false);

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

  // Buscar terapeutas disponíveis
  useEffect(() => {
    const fetchTherapists = async () => {
      setLoadingTherapists(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email')
          .like('role', 'therapist%');

        if (error) throw error;
        setTherapists(data || []);
      } catch (err) {
        console.error('Erro ao buscar terapeutas:', err);
      } finally {
        setLoadingTherapists(false);
      }
    };

    fetchTherapists();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRequest.therapistId || !newRequest.date || !newRequest.time) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await createRequest(
        newRequest.therapistId,
        newRequest.date,
        newRequest.time,
        newRequest.reason
      );

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
          <h2 className="text-xl font-bold text-slate-900 mb-4">Solicitar Novo Agendamento</h2>
          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Terapeuta *</label>
              <select
                value={newRequest.therapistId}
                onChange={(e) => setNewRequest({ ...newRequest, therapistId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecione um terapeuta</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </option>
                ))}
              </select>
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
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors"
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

      {/* Solicitações Pendentes */}
      {requests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Minhas Solicitações</h2>
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {request.therapist?.name || 'Terapeuta'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      📅 {new Date(request.requested_date).toLocaleDateString('pt-BR')} às{' '}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
