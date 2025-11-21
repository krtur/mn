import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

const MeuAtendimento: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

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
                  <span className="text-slate-700">Certificação Internacional em TRG (CITRG)</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Especialização em Ansiedade e Estresse Pós-Traumático</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Formação em Terapia Focada nas Emoções</span>
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
                  <span className="text-slate-700">Certificação Internacional em TRG (CITRG)</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Especialização em Terapia de Casal e Família</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Pós-graduação em Neurociência e Comportamento</span>
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
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); alert('Redirecionando para agendamento...'); }}
          className="btn-primary"
        >
          Agende Sua Sessão
        </a>
      </div>
    </section>
  );
};

export default MeuAtendimento;
