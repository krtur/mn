import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import DirectRestApiForm from './DirectRestApiForm';

const MeuAtendimento: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  const [showForm, setShowForm] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  
  // IDs dos terapeutas
  const therapistIds = {
    marcelo: '028d8869-679f-4093-b435-1a43b6ced0e2',
    nadielma: '83273ffc-c878-4abc-a24b-e35fd4801339'
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h2 className="heading-primary mb-6">
          {t('therapists.title')} <span className="gradient-text">{t('therapists.subtitle')}</span>
        </h2>
        <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
          {t('therapists.description')}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Marcelo's Profile */}
        <div className="card-premium bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200 overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 p-10">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 shadow-md">
              <img 
                src="/marcelo.png" 
                alt="Terapeuta Marcelo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-3xl font-bold text-slate-900 text-center md:text-left">{t('therapists.marcelo')}</h3>
            <p className="text-primary-600 font-semibold mt-2 text-lg text-center md:text-left">{t('therapists.marceloRole')}</p>
            <p className="mt-4 text-slate-700 leading-relaxed text-center md:text-left">
              {t('therapists.marceloDesc')}
            </p>
            <div className="mt-6">
              <h4 className="font-bold text-slate-900 mb-3 text-center md:text-left">📚 Formação e Especializações:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Master Terapeuta TRG</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Psicanalista</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Pós em Neuropsicologia</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Pós em Psicologia Clínica</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">PNL</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">TCC</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nadielma's Profile */}
        <div className="card-premium bg-gradient-to-br from-accent-50 to-primary-50 border-2 border-accent-200 overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 p-10">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-accent-100 to-primary-100 shadow-md">
              <img 
                src="/nadielma.png" 
                alt="Terapeuta Nadielma" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-3xl font-bold text-slate-900 text-center md:text-left">{t('therapists.nadielma')}</h3>
            <p className="text-accent-600 font-semibold mt-2 text-lg text-center md:text-left">{t('therapists.nadielmaRole')}</p>
            <p className="mt-4 text-slate-700 leading-relaxed text-center md:text-left">
              {t('therapists.nadielmaDesc')}
            </p>
            <div className="mt-6">
              <h4 className="font-bold text-slate-900 mb-3 text-center md:text-left">📚 Formação e Especializações:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Master Terapeuta TRG</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Psicanalista</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Pós em Neuropsicopedagogia</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Pós em Psicologia Clínica</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="card-premium bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 p-14 text-center mt-20">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          {t('cta.title')} {t('cta.subtitle')}
        </h3>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          {t('cta.description')}
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Agende Sua Sessão
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
              <DirectRestApiForm 
                onSuccess={() => setTimeout(() => setShowForm(false), 3000)}
                onCancel={() => setShowForm(false)}
                preselectedTherapist={selectedTherapist || undefined}
                isModal={true}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MeuAtendimento;
