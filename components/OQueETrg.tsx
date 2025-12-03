import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import PublicApiForm from './PublicApiForm';
import { openModalAndEnsureVisibility } from './utils/modalUtils';

interface Protocol {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const protocols: Protocol[] = [
  {
    id: 1,
    name: 'Cronológico',
    description: 'Reprocessamento em todas as etapas de sua vida até os dias atuais. Suas lembranças traumáticas não te afetarão mais.',
    icon: '📅',
  },
  {
    id: 2,
    name: 'Somático',
    description: 'Reprocessamento de toda somatização por conta dos traumas vividos.',
    icon: '💪',
  },
  {
    id: 3,
    name: 'Temático',
    description: 'Reprocessamento de temas que lhe causam desequilíbrio emocional, fobias, inseguranças, ansiedades, medos, etc.',
    icon: '🎯',
  },
  {
    id: 4,
    name: 'Futuro',
    description: 'Reprocessamento dos medos futuros que te paralisam, e deixam sem perspectiva, com incertezas etc.',
    icon: '🚀',
  },
  {
    id: 5,
    name: 'Potencialização',
    description: 'Agora sem os medos e crenças limitantes, você estará mais confiante em você, sua autoestima te motiva mais ainda.',
    icon: '✨',
  },
];

const OQueETrg: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="heading-primary mb-6">
            O que é <span className="gradient-text">TRG</span>?
          </h2>
          <p className="text-xl text-slate-600">
            Terapia de Reprocessamento Generativo
          </p>
        </div>

        {/* Introdução Principal */}
        <div className="card-premium bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 p-8 md:p-12 mb-12">
          <p className="text-lg md:text-xl text-slate-800 leading-relaxed mb-6">
            A <strong>TRG (Terapia de Reprocessamento Generativo)</strong> é uma terapia de curto período, baseada em resultados, que <strong>reestrutura sua psique na raiz dos problemas</strong>, em todas as fases da sua vida, eliminando traumas, fobias, bloqueios emocionais e muitos transtornos como ansiedade, depressão, pânico entre muitos outros.
          </p>
          <p className="text-lg md:text-xl text-slate-800 leading-relaxed">
            A grande maioria dos clientes começam o tratamento com a TRG por conta de um problema que considera maior em sua vida, no entanto <strong>levam como bônus a resolução de muitos outros</strong> que não se dava conta, inclusive somáticos!
          </p>
        </div>

        {/* Vídeo Explicativo */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Entenda Melhor a TRG
          </h3>
          <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full aspect-video">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/nKmNnM596-c"
                title="O que é TRG - Terapia de Reprocessamento Generativo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Protocolos */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Protocolos Terapêuticos da TRG
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {protocols.map((protocol) => (
              <div
                key={protocol.id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="text-5xl mb-4 text-center">{protocol.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 text-center">
                  {protocol.name}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed text-center flex-grow">
                  {protocol.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Dúvidas Frequentes
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors duration-200"
              >
                <h4 className="text-lg font-bold text-slate-900">
                  A TRG tem algo a ver com regressão ou hipnoterapia?
                </h4>
                <span className={`text-2xl text-primary-600 transition-transform duration-300 ${expandedFaq === 1 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedFaq === 1 && (
                <div className="px-6 pb-6 border-t border-slate-200 bg-slate-50">
                  <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg mb-6">
                    <div className="relative w-full aspect-video">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/V2RwBqeVcl4"
                        title="TRG - Regressão ou Hipnoterapia?"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Não!</strong> A TRG é diferente das terapias convencionais, pois não é baseada na fala e também não é hipnoterapia ou regressão. A TRG foca não só nos sintomas presentes, mas nas experiências passadas e traumas que os originaram, ou seja, na raiz dos problemas. Pode ser feita tanto presencial como por videochamadas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apresentação Detalhada */}
        <div className="space-y-12">
          {/* Reprocessamento e Memória */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-300 shadow-lg p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              🧠 Reprocessamento e Memória
            </h3>
            <div className="space-y-4 text-slate-700 text-lg leading-relaxed">
              <p>
                A memória retém <strong>100% das experiências vivenciadas</strong>, com cerca de <strong>95% dessas memórias armazenadas no inconsciente</strong>, onde são registrados absolutamente tudo: cheiro, temperatura, audiovisual, enfim, tudo é armazenado.
              </p>
              <p>
                Dependendo do trauma, um simples cheiro pode ser o gatilho para a depressão, ansiedade, ou qualquer transtorno. Eventos traumáticos se tornam a base para comportamentos e tomadas de decisão, influenciando a vida do indivíduo.
              </p>
              <p>
                <strong>Durante o reprocessamento, novas sinapses são formadas</strong>, permitindo após, até mesmo falar sobre os traumas sem nenhuma dor emocional.
              </p>
            </div>
          </div>

          {/* Abordagem da TRG */}
          <div className="card-premium bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-300 p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              🎯 Abordagem da Terapia de Reprocessamento Generativo (TRG)
            </h3>
            <div className="space-y-4 text-slate-700 text-lg leading-relaxed">
              <p>
                Diferente das terapias convencionais, pois <strong>não é baseada na fala</strong>, a TRG foca não só nos sintomas presentes, mas nas <strong>experiências passadas e traumas que os originaram</strong>, ou seja, na raiz dos problemas.
              </p>
              <p>
                Pode ser feita tanto presencial como por videochamadas, oferecendo flexibilidade e acessibilidade para todos os clientes.
              </p>
            </div>
          </div>

          {/* Modelo Teórico */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-300 shadow-lg p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              📚 Modelo Teórico da TRG
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              Considera as complexas interações entre a mente consciente e inconsciente.
            </p>
            
            <h4 className="text-xl font-bold text-slate-900 mb-4">Regras do Inconsciente na TRG:</h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-bold text-slate-900 mb-2">💾 Registra e Guarda 100%</p>
                <p className="text-slate-700">Registra e guarda 100% de tudo em cada acontecimento, temperatura, cheiro, sons, o que está no campo de visão, tato...</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-bold text-slate-900 mb-2">🔗 Generaliza</p>
                <p className="text-slate-700">Generaliza tudo que guardou e se a dor não foi dissipada, qualquer coisa semelhante pode ser um gatilho emocional.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-bold text-slate-900 mb-2">⏰ Atemporalidade</p>
                <p className="text-slate-700">Não tem passado ou futuro, ou seja, eventos passados continuam a impactar o presente através de um simples gatilho.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-bold text-slate-900 mb-2">😊 Busca pela Felicidade</p>
                <p className="text-slate-700">Constantemente busca pela felicidade, no entanto devido aos traumas avança para a próxima regra.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-bold text-slate-900 mb-2">🔄 Compulsão à Repetição</p>
                <p className="text-slate-700">Tendência do inconsciente em repetir situações similares buscando a felicidade, mas como o trauma não foi resolvido, retorna sempre ao mesmo problema.</p>
              </div>
            </div>
          </div>

          {/* Perspectivas e Neurobiologia */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-300 shadow-lg p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              🌟 Perspectivas e Reprocessamento Neurobiológico
            </h3>
            <div className="space_y-4 text-slate-700 text-lg leading-relaxed">
              <p className="mb-4">
                Há um <strong>crescente interesse nacional e internacional</strong> pela TRG devido à sua abordagem inovadora e resultados comprovados no reprocessamento de traumas.
              </p>
              <p className="mb-4">
                <strong>Criação de novas sinapses a cada ciclo:</strong> Os neurônios criam novas conexões saudáveis, o que resulta na transformação positiva psicoemocional proporcionando uma maturidade progressiva.
              </p>
              <p>
                <strong>Todos os clientes são beneficiados</strong> além de saúde psicoemocional, com grande aumento de autoestima e melhora na saúde física, pois uma grande maioria de doenças físicas tem início na mente.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="card-premium bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 p-12 text-center mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Pronto para transformar sua vida?
          </h3>
          <p className="text-lg text-slate-600 mb-8">
            Agende uma sessão gratuita de 30 minutos e descubra como a TRG pode revolucionar sua saúde emocional.
          </p>
          <button
            onClick={() => openModalAndEnsureVisibility(setShowForm)}
            className="btn-primary"
          >
            Agende Sua Sessão Gratuita
          </button>
          
          {/* Modal do formulário */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative animate-fade-in-up">
                <button 
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  title="Fechar formulário"
                  aria-label="Fechar formulário"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <PublicApiForm 
                  onSuccess={() => setTimeout(() => setShowForm(false), 3000)}
                  onCancel={() => setShowForm(false)}
                  isModal={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OQueETrg;