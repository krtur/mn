import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, BarChart3, AlertCircle, CheckCircle, Calendar, Clock, Loader } from 'lucide-react';
import { useTdahScreening, TdahScreeningResult } from '../../hooks/useTdahScreening';
import { usePatients } from '../../hooks/usePatients';
import { TDAH_QUESTIONS } from '../../data/tdahQuestions';

const RESPONSE_OPTIONS = [
  { value: 0, label: 'Nunca', color: 'bg-green-100 text-green-800' },
  { value: 1, label: 'Raramente', color: 'bg-blue-100 text-blue-800' },
  { value: 2, label: 'Às vezes', color: 'bg-yellow-100 text-yellow-800' },
  { value: 3, label: 'Frequentemente', color: 'bg-orange-100 text-orange-800' },
  { value: 4, label: 'Quase sempre', color: 'bg-red-100 text-red-800' },
];

const CATEGORY_LABELS: Record<string, string> = {
  A: 'Desatenção',
  B: 'Hiperatividade / Impulsividade',
  C: 'Função Executiva',
  D: 'Regulação Emocional',
  E: 'Memória de Trabalho',
  F: 'Impacto na Vida',
};

export const TdahResults: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [screenings, setScreenings] = useState<TdahScreeningResult[]>([]);
  const [selectedScreening, setSelectedScreening] = useState<TdahScreeningResult | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { patients, loading: patientsLoading } = usePatients();
  const { getTherapistPatientScreenings, loading: screeningsLoading } = useTdahScreening();

  const loadScreenings = useCallback(async () => {
    if (!selectedPatientId) return;
    console.log('🔍 Buscando triagens para paciente:', selectedPatientId);
    const results = await getTherapistPatientScreenings(selectedPatientId);
    console.log('📊 Triagens encontradas:', results.length);
    
    // Adicionar mais logs para debug
    if (results.length === 0) {
      console.log('⚠️ ALERTA: Nenhuma triagem encontrada para este paciente');
    } else {
      console.log('✅ Triagens encontradas:', results.map(r => ({
        id: r.id,
        patient_id: r.patient_id,
        therapist_id: r.therapist_id,
        created_at: r.created_at,
        risk_level: r.risk_level
      })));
    }
    
    setScreenings(results);
    // Resetar triagem selecionada antes de carregar nova
    setSelectedScreening(null);
    setExpandedCategory(null);
    if (results.length > 0) {
      setSelectedScreening(results[0]);
    }
  }, [selectedPatientId, getTherapistPatientScreenings]);

  // Carregar triagens quando um paciente é selecionado
  useEffect(() => {
    if (selectedPatientId) {
      loadScreenings();
    }
  }, [selectedPatientId, loadScreenings]);

  const getRiskLevel = (percentage: number) => {
    if (percentage >= 75) return { level: 'Muito Alto', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (percentage >= 50) return { level: 'Alto', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (percentage >= 25) return { level: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Baixo', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Triagens TDAH dos Pacientes</h1>
        <p className="text-slate-600">Visualize e analise os resultados das triagens TDAH de seus pacientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pacientes */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Pacientes</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Nenhum paciente encontrado</p>
            ) : (
              filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-2 ${
                    selectedPatientId === patient.id
                      ? 'bg-teal-100 border-teal-600 text-teal-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-sm opacity-75">{patient.email}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Triagens e Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatientId ? (
            <>
              {/* Lista de Triagens */}
              {screenings.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Triagens Realizadas</h2>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {screenings.map((screening) => {
                      const risk = getRiskLevel(screening.total_percentage);
                      return (
                        <button
                          key={screening.id}
                          onClick={() => setSelectedScreening(screening)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-2 ${
                            selectedScreening?.id === screening.id
                              ? 'bg-teal-100 border-teal-600'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{formatDate(screening.created_at)}</p>
                              <p className={`text-sm font-bold ${risk.color}`}>{risk.level}</p>
                            </div>
                            <p className={`text-2xl font-bold ${risk.color}`}>{screening.total_percentage}%</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Detalhes da Triagem */}
              {selectedScreening && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className={`${getRiskLevel(selectedScreening.total_percentage).bg} border-2 ${getRiskLevel(selectedScreening.total_percentage).border} rounded-xl p-8 text-center`}>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {selectedScreening.total_percentage >= 50 ? (
                        <AlertCircle className={`w-8 h-8 ${getRiskLevel(selectedScreening.total_percentage).color}`} />
                      ) : (
                        <CheckCircle className={`w-8 h-8 ${getRiskLevel(selectedScreening.total_percentage).color}`} />
                      )}
                      <h3 className={`text-3xl font-bold ${getRiskLevel(selectedScreening.total_percentage).color}`}>
                        {getRiskLevel(selectedScreening.total_percentage).level}
                      </h3>
                    </div>
                    <p className="text-slate-700 mb-4">Pontuação Total: <span className="font-bold text-2xl">{selectedScreening.total_percentage}%</span></p>
                    <div className="flex items-center justify-center gap-2 text-slate-600 mb-4">
                      <Clock className="w-5 h-5" />
                      <span className="text-lg font-semibold">Duração: {formatTime(selectedScreening.test_duration)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">{formatDate(selectedScreening.created_at)}</span>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-teal-600" />
                      Análise por Categoria
                    </h3>

                    {Object.entries({
                      A: selectedScreening.category_a_score,
                      B: selectedScreening.category_b_score,
                      C: selectedScreening.category_c_score,
                      D: selectedScreening.category_d_score,
                      E: selectedScreening.category_e_score,
                      F: selectedScreening.category_f_score,
                    }).map(([category, score]) => {
                      const maxScore = 72; // 18 perguntas * 4 pontos máximos
                      const percentage = Math.round((score / maxScore) * 100);
                      const risk = getRiskLevel(percentage);
                      const isExpanded = expandedCategory === category;
                      const categoryQuestions = Object.entries(selectedScreening.answers)
                        .filter(([qId]) => {
                          const questionId = parseInt(qId);
                          // Encontrar a pergunta correspondente para verificar a categoria
                          const question = TDAH_QUESTIONS.find(
                            (q: any) => q.id === questionId
                          );
                          return question?.category === category;
                        });

                      return (
                        <div key={category} className={`${risk.bg} border-2 ${risk.border} rounded-lg overflow-hidden`}>
                          <button
                            onClick={() => setExpandedCategory(isExpanded ? null : category)}
                            className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-left">
                                <h4 className="font-bold text-slate-900">{category}. {CATEGORY_LABELS[category]}</h4>
                                <p className="text-sm text-slate-600">{categoryQuestions.length} perguntas</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className={`text-2xl font-bold ${risk.color}`}>{percentage}%</p>
                                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      percentage >= 75
                                        ? 'bg-red-600'
                                        : percentage >= 50
                                        ? 'bg-orange-600'
                                        : percentage >= 25
                                        ? 'bg-yellow-600'
                                        : 'bg-green-600'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="border-t border-slate-300 p-4 space-y-3">
                              {categoryQuestions.map(([qId, answer]) => {
                                const questionId = parseInt(qId);
                                const question = TDAH_QUESTIONS.find(
                                  (q: any) => q.id === questionId
                                );
                                const responseLabel = RESPONSE_OPTIONS[answer as number]?.label || 'N/A';

                                return (
                                  <div key={qId} className="flex items-start gap-3">
                                    <div className="flex-1">
                                      <p className="text-sm text-slate-700">{questionId}. {question?.text}</p>
                                      <p className="text-xs text-slate-500 mt-1">
                                        Resposta: <span className="font-semibold">{responseLabel}</span>
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {screenings.length === 0 && (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-semibold">Este paciente ainda não realizou nenhuma triagem TDAH</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-8 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold">Selecione um paciente para visualizar suas triagens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
