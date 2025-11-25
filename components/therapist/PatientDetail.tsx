import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { usePatientNotes } from '../../hooks/usePatientNotes';
import { usePatientProgress } from '../../hooks/usePatientProgress';
import { useSessionHistory } from '../../hooks/useSessionHistory';
import { useAppointments } from '../../hooks/useAppointments';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  created_at: string;
}

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'progress' | 'sessions' | 'appointments'>('info');
  const [newNote, setNewNote] = useState('');
  const [newNoteTags, setNewNoteTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { notes, addNote } = usePatientNotes(patient.id);
  const { progress, goals, addProgressEntry, addGoal } = usePatientProgress(patient.id);
  const { sessions, getStatistics, getRecentSessions } = useSessionHistory(patient.id);
  const { appointments } = useAppointments();

  const patientAppointments = appointments.filter(a => a.patient_id === patient.id);
  const upcomingAppointments = patientAppointments.filter(
    a => new Date(a.start_time) > new Date() && a.status !== 'cancelled'
  );

  const stats = getStatistics();
  const recentSessions = getRecentSessions(5);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await addNote(newNote, newNoteTags);
      setNewNote('');
      setNewNoteTags([]);
    } catch (err) {
      console.error('Erro ao adicionar nota:', err);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newNoteTags.includes(tagInput.trim())) {
      setNewNoteTags([...newNoteTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewNoteTags(newNoteTags.filter(t => t !== tag));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'no_show':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Realizada';
      case 'no_show':
        return 'Não compareceu';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{patient.name}</h2>
            <p className="text-teal-100 mt-1">CPF: {patient.cpf}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {(['info', 'notes', 'progress', 'sessions', 'appointments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'info' && 'Informações'}
              {tab === 'notes' && 'Anotações'}
              {tab === 'progress' && 'Progresso'}
              {tab === 'sessions' && 'Sessões'}
              {tab === 'appointments' && 'Agendamentos'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="text-teal-600" size={20} />
                    <span className="text-sm text-slate-600">Email</span>
                  </div>
                  <p className="font-semibold text-slate-900">{patient.email}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="text-teal-600" size={20} />
                    <span className="text-sm text-slate-600">Telefone</span>
                  </div>
                  <p className="font-semibold text-slate-900">{patient.phone}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-teal-600" size={20} />
                    <span className="text-sm text-slate-600">Cadastrado em</span>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-sm text-slate-600">Taxa de Comparecimento</span>
                  </div>
                  <p className="font-semibold text-slate-900">{stats.completionRate}%</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Estatísticas de Sessões</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-sm text-slate-600 mt-1">Total de Sessões</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                    <p className="text-sm text-slate-600 mt-1">Realizadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{stats.noShow}</p>
                    <p className="text-sm text-slate-600 mt-1">Não Compareceu</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-600">{stats.avgDuration}min</p>
                    <p className="text-sm text-slate-600 mt-1">Duração Média</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Adicionar Anotação</h3>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Digite sua anotação clínica aqui..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4 resize-none"
                  rows={4}
                />

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Adicionar tag (pressione Enter)..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm"
                    >
                      Adicionar
                    </button>
                  </div>

                  {newNoteTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newNoteTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-teal-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Salvar Anotação
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <p className="text-center text-slate-600 py-8">Nenhuma anotação ainda</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-slate-500">
                          {new Date(note.created_at).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(note.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <p className="text-slate-900 mb-3">{note.content}</p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PROGRESS TAB */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Goals */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Metas de Tratamento</h3>
                <div className="space-y-3">
                  {goals.length === 0 ? (
                    <p className="text-center text-slate-600 py-4">Nenhuma meta definida</p>
                  ) : (
                    goals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          goal.status === 'completed'
                            ? 'bg-green-50 border-green-600'
                            : goal.status === 'paused'
                            ? 'bg-yellow-50 border-yellow-600'
                            : 'bg-blue-50 border-blue-600'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{goal.title}</p>
                            <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              Meta: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              goal.status === 'completed'
                                ? 'bg-green-200 text-green-800'
                                : goal.status === 'paused'
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-blue-200 text-blue-800'
                            }`}
                          >
                            {goal.status === 'completed' && '✓ Concluída'}
                            {goal.status === 'active' && '⏳ Ativa'}
                            {goal.status === 'paused' && '⏸ Pausada'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Progress Entries */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Histórico de Progresso</h3>
                <div className="space-y-3">
                  {progress.length === 0 ? (
                    <p className="text-center text-slate-600 py-4">Nenhum registro de progresso</p>
                  ) : (
                    progress.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-slate-900">{entry.category}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(entry.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-teal-600">{entry.score}</div>
                            <p className="text-xs text-slate-500">/10</p>
                          </div>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-slate-600 mt-2">{entry.notes}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SESSIONS TAB */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-sm text-slate-600 mt-1">Total</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-sm text-slate-600 mt-1">Realizadas</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-2xl font-bold text-red-600">{stats.noShow}</p>
                  <p className="text-sm text-slate-600 mt-1">Não Compareceu</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-2xl font-bold text-slate-600">{stats.avgDuration}min</p>
                  <p className="text-sm text-slate-600 mt-1">Duração Média</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Sessões Recentes</h3>
                <div className="space-y-3">
                  {recentSessions.length === 0 ? (
                    <p className="text-center text-slate-600 py-4">Nenhuma sessão registrada</p>
                  ) : (
                    recentSessions.map((session) => (
                      <div key={session.id} className={`p-4 rounded-lg border-l-4 ${getStatusColor(session.status)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {new Date(session.session_date).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              Duração: {session.duration_minutes} minutos
                            </p>
                            {session.notes && (
                              <p className="text-sm text-slate-600 mt-2">{session.notes}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(session.status)}`}>
                            {getStatusLabel(session.status)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Próximos Agendamentos</h3>
                <div className="space-y-3">
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-center text-slate-600 py-4">Nenhum agendamento próximo</p>
                  ) : (
                    upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {new Date(apt.start_time).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              apt.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {apt.status === 'confirmed' ? '✓ Confirmado' : '⏳ Pendente'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Histórico de Agendamentos</h3>
                <div className="space-y-3">
                  {patientAppointments.filter(a => new Date(a.start_time) <= new Date()).length === 0 ? (
                    <p className="text-center text-slate-600 py-4">Nenhum agendamento anterior</p>
                  ) : (
                    patientAppointments
                      .filter(a => new Date(a.start_time) <= new Date())
                      .slice(0, 5)
                      .map((apt) => (
                        <div key={apt.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <p className="font-semibold text-slate-900">
                            {new Date(apt.start_time).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {new Date(apt.start_time).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
