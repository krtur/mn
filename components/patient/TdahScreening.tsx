import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, BarChart3, CheckCircle, AlertCircle, ArrowRight, Clock, Save, Loader } from 'lucide-react';
import { TDAH_QUESTIONS, Question } from '../../data/tdahQuestions';
import { useTdahScreening } from '../../hooks/useTdahScreening';

interface Answer {
  questionId: number;
  value: number;
}

interface CategoryScore {
  category: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  questions: number;
}

const RESPONSE_OPTIONS = [
  { value: 0, label: 'Nunca', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 1, label: 'Raramente', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 2, label: 'Às vezes', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 3, label: 'Frequentemente', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 4, label: 'Quase sempre', color: 'bg-red-100 text-red-800 border-red-300' },
];

export const TdahScreening: React.FC = () => {
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [testDuration, setTestDuration] = useState<number | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { saveScreening, loading: savingLoading, error: savingError } = useTdahScreening();

  // Iniciar timer apenas quando o botão "Iniciar" for clicado
  const handleStartTest = () => {
    setTestStarted(true);
    setStartTime(Date.now());
  };

  // Atualizar tempo decorrido a cada segundo
  useEffect(() => {
    if (startTime === null || showResults) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, showResults]);

  // Salvar duração total quando o teste termina
  useEffect(() => {
    if (showResults && testDuration === null) {
      setTestDuration(elapsedTime);
    }
  }, [showResults, testDuration, elapsedTime]);

  const handleAnswer = (value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(TDAH_QUESTIONS[currentQuestion].id, value);
    setAnswers(newAnswers);

    if (currentQuestion < TDAH_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Última pergunta respondida - mostrar resultados e salvar automaticamente
      setShowResults(true);
    }
  };

  // Salvar automaticamente quando os resultados são mostrados
  useEffect(() => {
    if (showResults && testDuration !== null && !isSaving) {
      handleSaveResults();
    }
  }, [showResults]);

  const categoryScores = useMemo(() => {
    const scores: Record<string, CategoryScore> = {
      A: { category: 'A', label: 'Desatenção', score: 0, maxScore: 0, percentage: 0, questions: 0 },
      B: { category: 'B', label: 'Hiperatividade / Impulsividade', score: 0, maxScore: 0, percentage: 0, questions: 0 },
      C: { category: 'C', label: 'Função Executiva', score: 0, maxScore: 0, percentage: 0, questions: 0 },
      D: { category: 'D', label: 'Regulação Emocional', score: 0, maxScore: 0, percentage: 0, questions: 0 },
      E: { category: 'E', label: 'Memória de Trabalho', score: 0, maxScore: 0, percentage: 0, questions: 0 },
      F: { category: 'F', label: 'Impacto na Vida', score: 0, maxScore: 0, percentage: 0, questions: 0 },
    };

    TDAH_QUESTIONS.forEach((q) => {
      scores[q.category].maxScore += 4;
      scores[q.category].questions += 1;
      if (answers.has(q.id)) {
        scores[q.category].score += answers.get(q.id)!;
      }
    });

    Object.values(scores).forEach((s) => {
      s.percentage = s.maxScore > 0 ? Math.round((s.score / s.maxScore) * 100) : 0;
    });

    return Object.values(scores);
  }, [answers]);

  const totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
  const maxTotalScore = categoryScores.reduce((sum, cat) => sum + cat.maxScore, 0);
  const totalPercentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

  // Formatar tempo em MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRiskLevel = (percentage: number) => {
    if (percentage >= 75) return { level: 'Muito Alto', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (percentage >= 50) return { level: 'Alto', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (percentage >= 25) return { level: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Baixo', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const currentRisk = getRiskLevel(totalPercentage);
  const question = TDAH_QUESTIONS[currentQuestion];
  const currentAnswer = answers.get(question.id);

  // Função para salvar resultados no banco de dados
  const handleSaveResults = async () => {
    setIsSaving(true);
    try {
      const answersObj: Record<number, number> = {};
      answers.forEach((value, key) => {
        answersObj[key] = value;
      });

      console.log('💾 Iniciando salvamento de triagem...');
      console.log('📝 Respostas:', Object.keys(answersObj).length, 'perguntas respondidas');
      console.log('📊 Pontuação total:', totalPercentage, '%');

      const result = await saveScreening({
        answers: answersObj,
        categoryScores: {
          A: categoryScores[0].score,
          B: categoryScores[1].score,
          C: categoryScores[2].score,
          D: categoryScores[3].score,
          E: categoryScores[4].score,
          F: categoryScores[5].score,
        },
        totalScore,
        totalPercentage,
        testDuration,
      });

      if (result) {
        console.log('✅ Triagem salva com sucesso! ID:', result.id);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error('❌ Erro ao salvar triagem: resultado nulo');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar triagem:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Tela de boas-vindas antes de iniciar o teste
  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-2xl p-12 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-teal-600 text-white p-6 rounded-full">
              <AlertCircle className="w-12 h-12" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900">Triagem para TDAH para Adulto</h1>

          <div className="space-y-4 text-left">
            <p className="text-lg text-slate-700 leading-relaxed">
              Bem-vindo(a) à triagem de TDAH para adultos! Este teste foi desenvolvido para ajudar a identificar possíveis sintomas de Transtorno do Déficit de Atenção/Hiperatividade.
            </p>

            <div className="bg-white rounded-lg p-4 border-l-4 border-teal-600">
              <h3 className="font-semibold text-slate-900 mb-2">ℹ️ Informações Importantes:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span><strong>100 perguntas</strong> divididas em 6 categorias</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Tempo estimado: <strong>15-20 minutos</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Responda com <strong>sinceridade</strong> para obter uma avaliação precisa</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Não há respostas <strong>certas ou erradas</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Você pode <strong>voltar</strong> e mudar respostas anteriores</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <h3 className="font-semibold text-slate-900 mb-2">⚠️ Aviso Importante:</h3>
              <p className="text-sm text-slate-700">
                Este teste é apenas uma <strong>triagem</strong> e não substitui uma avaliação profissional. Os resultados devem ser discutidos com um psicólogo, psiquiatra ou neurologista para um diagnóstico preciso.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={handleStartTest}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Iniciar Teste</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-slate-500">
              Clique em "Iniciar Teste" para começar. O timer será acionado automaticamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Triagem para TDAH para Adulto</h1>
          <p className="text-slate-600">Resultados da sua avaliação</p>
        </div>

        {/* Overall Score */}
        <div className={`${currentRisk.bg} border-2 ${currentRisk.border} rounded-xl p-8 text-center`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            {totalPercentage >= 50 ? <AlertCircle className={`w-8 h-8 ${currentRisk.color}`} /> : <CheckCircle className={`w-8 h-8 ${currentRisk.color}`} />}
            <h2 className={`text-3xl font-bold ${currentRisk.color}`}>{currentRisk.level}</h2>
          </div>
          <p className="text-slate-700 mb-4">Pontuação Total: <span className="font-bold text-2xl">{totalPercentage}%</span></p>
          <div className="flex items-center justify-center gap-2 mb-4 text-slate-600">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-semibold">Tempo total: {testDuration !== null ? formatTime(testDuration) : formatTime(elapsedTime)}</span>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            {totalPercentage >= 75
              ? 'Seus sintomas sugerem características significativas de TDAH. Recomenda-se avaliação profissional com um especialista.'
              : totalPercentage >= 50
              ? 'Você apresenta alguns sintomas compatíveis com TDAH. Considere uma avaliação profissional.'
              : totalPercentage >= 25
              ? 'Você apresenta alguns sintomas, mas em nível moderado. Acompanhamento recomendado.'
              : 'Seus sintomas sugerem baixa probabilidade de TDAH. Continue monitorando sua saúde mental.'}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Análise por Categoria
          </h3>

          {categoryScores.map((cat) => {
            const risk = getRiskLevel(cat.percentage);
            const isExpanded = expandedCategory === cat.category;
            const categoryQuestions = TDAH_QUESTIONS.filter(q => q.category === cat.category);

            return (
              <div key={cat.category} className={`${risk.bg} border-2 ${risk.border} rounded-lg overflow-hidden`}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                  className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900">{cat.category}. {cat.label}</h4>
                      <p className="text-sm text-slate-600">{cat.questions} perguntas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${risk.color}`}>{cat.percentage}%</p>
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full transition-all ${
                          cat.percentage >= 75 ? 'bg-red-600' :
                          cat.percentage >= 50 ? 'bg-orange-600' :
                          cat.percentage >= 25 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`} style={{ width: `${cat.percentage}%` }} />
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-300 p-4 space-y-3">
                    {categoryQuestions.map((q) => (
                      <div key={q.id} className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{q.id}. {q.text}</p>
                          {answers.has(q.id) && (
                            <p className="text-xs text-slate-500 mt-1">
                              Resposta: <span className="font-semibold">{RESPONSE_OPTIONS[answers.get(q.id)!].label}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Test Summary */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            Resumo do Teste
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-600">Perguntas Respondidas</p>
              <p className="text-2xl font-bold text-slate-900">{answers.size}/100</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Tempo Total</p>
              <p className="text-2xl font-bold text-teal-600 flex items-center justify-center gap-1">
                <Clock className="w-5 h-5" />
                {testDuration !== null ? formatTime(testDuration) : formatTime(elapsedTime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Pontuação</p>
              <p className="text-2xl font-bold text-slate-900">{totalPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Recomendações
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Este teste é apenas uma triagem e não substitui uma avaliação profissional.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Consulte um psicólogo, psiquiatra ou neurologista para diagnóstico preciso.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Compartilhe estes resultados com seu terapeuta para discussão.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Existem tratamentos eficazes disponíveis, incluindo terapia e medicação.</span>
            </li>
          </ul>
        </div>

        {/* Saving Status */}
        <div className="w-full space-y-3">
          {isSaving || savingLoading ? (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center gap-2 text-blue-700">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="font-semibold">Salvando seus resultados...</span>
            </div>
          ) : saveSuccess ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">✅ Resultados salvos com sucesso! Seu terapeuta pode visualizá-los.</span>
            </div>
          ) : savingError ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Erro ao salvar: {savingError}</span>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              setAnswers(new Map());
              setCurrentQuestion(0);
              setShowResults(false);
              setExpandedCategory(null);
              setSaveSuccess(false);
              setTestStarted(false);
            }}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
          >
            Refazer Teste
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            Imprimir Resultados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-slate-900 flex-1">Triagem para TDAH para Adulto</h1>
          <div className="flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-lg font-semibold">
            <Clock className="w-5 h-5" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
        <p className="text-slate-600 mb-4">Responda com sinceridade para obter uma avaliação mais precisa</p>
        <div className="flex items-center justify-center gap-2">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-600 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / TDAH_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600 ml-4">{currentQuestion + 1} / {TDAH_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Category Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
          Categoria {question.category}: {question.categoryLabel}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-teal-600">
        <p className="text-2xl font-semibold text-slate-900 mb-2">Pergunta {currentQuestion + 1}</p>
        <p className="text-lg text-slate-700 leading-relaxed">{question.text}</p>
      </div>

      {/* Response Options */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-600">Como você se sente em relação a essa afirmação?</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {RESPONSE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`flex-1 min-w-[120px] px-3 py-3 rounded-lg border-2 font-semibold transition-all text-center ${
                currentAnswer === option.value
                  ? 'bg-teal-600 text-white border-teal-700 ring-2 ring-offset-2 ring-teal-600 shadow-lg'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{option.label}</span>
                {currentAnswer === option.value && <CheckCircle className="w-4 h-4" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-between pt-6">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={() => {
            if (currentQuestion < TDAH_QUESTIONS.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
            } else {
              setShowResults(true);
            }
          }}
          disabled={currentAnswer === undefined}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          {currentQuestion === TDAH_QUESTIONS.length - 1 ? 'Ver Resultados' : 'Próxima'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Info */}
      <div className="text-center text-sm text-slate-500">
        <p>Você respondeu {answers.size} de {TDAH_QUESTIONS.length} perguntas</p>
      </div>
    </div>
  );
};
