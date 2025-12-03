import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import WhatsappIcon from './icons/WhatsappIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import HeartIcon from './icons/HeartIcon';
import BoltIcon from './icons/BoltIcon';
import PublicApiForm from './PublicApiForm';
import { openModalAndEnsureVisibility } from './utils/modalUtils';

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  // WhatsApp links for therapists (mantidos como fallback)
  const marceloWhatsapp = 'https://wa.me/5519981109732';
  const nadielmaWhatsapp = 'https://wa.me/5519981740279';
  
  // Estados para controlar os modais de agendamento
  const [showMarceloForm, setShowMarceloForm] = useState(false);
  const [showNadielmaForm, setShowNadielmaForm] = useState(false);
  const [showGenericForm, setShowGenericForm] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);
  
  // Função para abrir modal na posição atual do scroll e garantir visibilidade
  const openModalAtCurrentPosition = (setterFunction: React.Dispatch<React.SetStateAction<boolean>>) => {
    // Usa a função de utilidade para abrir o modal e garantir visibilidade
    openModalAndEnsureVisibility(setterFunction);
  };

  const stats = [
    { number: '200+', label: t('stats.patients'), icon: '👥' },
    { number: '95%', label: t('stats.satisfaction'), icon: '⭐' },
    { number: '5', label: t('stats.experience'), icon: '🎓' },
  ];

  const benefits = [
    { title: t('benefits.benefit1'), description: t('benefits.benefit1Desc'), icon: '⚡' },
    { title: t('benefits.benefit2'), description: t('benefits.benefit2Desc'), icon: '❤️' },
    { title: t('benefits.benefit3'), description: t('benefits.benefit3Desc'), icon: '🕐' },
    { title: t('benefits.benefit4'), description: t('benefits.benefit4Desc'), icon: '✓' },
  ];

  const testimonials = [
    { text: '"Mudou minha vida em poucas sessões!"', author: 'Cliente Satisfeito' },
    { text: '"Profissionais incríveis e atenciosos"', author: 'Paciente Transformado' },
    { text: '"Finalmente encontrei alívio"', author: 'Pessoa Grata' },
  ];

  return (
    <section className="w-full">
      {/* Hero Main */}
      <div className="container mx-auto px-4 py-24 md:py-40 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="mb-12 animate-fade-in">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-base font-bold tracking-wide border border-primary-200">
              {t('hero.badge')}
            </span>
          </div>

          {/* Main Heading - Disruptive */}
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-8 animate-slide-up animation-delay-100">
            <span className="gradient-text">{t('hero.title1')}</span> {t('hero.title2')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600">{t('hero.title3')}</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed max-w-4xl mx-auto mb-8 animate-slide-up animation-delay-200">
            {t('hero.subtitle')}
          </p>

          {/* Key Promise */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up animation-delay-250">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">{t('hero.promise1')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <BoltIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">{t('hero.promise2')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
              <HeartIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">{t('hero.promise3')}</span>
            </div>
          </div>

          {/* CTA Box - Premium */}
          <div className="mt-12 animate-slide-up animation-delay-300">
            <div className="glass-effect bg-gradient-to-br from-primary-50 via-accent-50 to-primary-50 rounded-3xl border-2 border-primary-200 shadow-2xl p-12 mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full opacity-10 -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">{t('cta.ctaBoxLabel')}</p>
                <p className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  {t('cta.ctaBoxTitle')} <span className="gradient-text">TRG</span>
                </p>
                <p className="text-lg text-slate-600 mb-2">{t('cta.ctaBoxSubtitle')}</p>
                <p className="text-sm text-slate-500">{t('cta.ctaBoxFeatures')}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
              <a
                href={marceloWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex items-center justify-center w-full sm:w-auto gap-3 text-lg"
              >
                <WhatsappIcon className="w-6 h-6" />
                <span>{t('cta.buttonMarcelo')}</span>
              </a>
              <a
                href={nadielmaWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-accent flex items-center justify-center w-full sm:w-auto gap-3 text-lg"
              >
                <WhatsappIcon className="w-6 h-6" />
                <span>{t('cta.buttonNadielma')}</span>
              </a>
            </div>
            
            {/* Modal para Marcelo */}
            {showMarceloForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative animate-fade-in-up">
                  <button 
                    onClick={() => setShowMarceloForm(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    title="Fechar formulário"
                    aria-label="Fechar formulário"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <PublicApiForm 
                    onSuccess={() => setTimeout(() => setShowMarceloForm(false), 3000)}
                    onCancel={() => setShowMarceloForm(false)}
                    preselectedTherapist="028d8869-679f-4093-b435-1a43b6ced0e2"
                    isModal={true}
                  />
                </div>
              </div>
            )}
            
            {/* Modal para Nadielma */}
            {showNadielmaForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative animate-fade-in-up">
                  <button 
                    onClick={() => setShowNadielmaForm(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    title="Fechar formulário"
                    aria-label="Fechar formulário"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <PublicApiForm 
                    onSuccess={() => setTimeout(() => setShowNadielmaForm(false), 3000)}
                    onCancel={() => setShowNadielmaForm(false)}
                    preselectedTherapist="83273ffc-c878-4abc-a24b-e35fd4801339"
                    isModal={true}
                  />
                </div>
              </div>
            )}
            
            {/* Modal para Agendamento Genérico (com seleção de terapeuta) */}
            {showGenericForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative animate-fade-in-up">
                  <button 
                    onClick={() => setShowGenericForm(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    title="Fechar formulário"
                    aria-label="Fechar formulário"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <PublicApiForm 
                    onSuccess={() => setTimeout(() => setShowGenericForm(false), 3000)}
                    onCancel={() => setShowGenericForm(false)}
                    isModal={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center text-white animate-fade-in animation-delay-${(index + 1) * 100}`}>
                <div className="text-4xl md:text-5xl font-black mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-3">{stat.number}</div>
                <div className="text-sm md:text-base text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t('benefits.title')} <span className="gradient-text">{t('benefits.subtitle')}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('benefits.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`card-premium p-10 hover:shadow-2xl transition-all duration-300 animate-slide-up animation-delay-${(index + 1) * 100}`}
              >
                <div className="text-5xl mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Therapists Section */}
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t('therapists.title')} <span className="gradient-text">{t('therapists.subtitle')}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('therapists.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="flex justify-center animate-fade-in">
              <img 
                src="/terapeutas.png" 
                alt="Nossos Terapeutas - Marcelo e Nadielma" 
                className="rounded-2xl shadow-2xl max-w-md w-full object-cover hover:shadow-xl transition-all duration-300"
              />
            </div>

            {/* Content */}
            <div className="animate-slide-up">
              <div className="space-y-8">
                <div className="card-premium p-8 border-l-4 border-primary-500">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('therapists.marcelo')}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{t('therapists.marceloRole')}</p>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {t('therapists.marceloDesc')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">CITRG</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">Ansiedade</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">Traumas</span>
                  </div>
                </div>

                <div className="card-premium p-8 border-l-4 border-accent-500">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('therapists.nadielma')}</h3>
                  <p className="text-accent-600 font-semibold mb-3">{t('therapists.nadielmaRole')}</p>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {t('therapists.nadielmaDesc')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold">CITRG</span>
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold">Casais</span>
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold">Família</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">
            {t('cta.title')} <span className="gradient-text">{t('cta.subtitle')}</span>
          </h2>
          <p className="text-xl text-slate-600 mb-16">
            {t('cta.description')}
          </p>
          {/* Main CTA Button */}
          <div className="mb-8">
            <button
              onClick={() => openModalAndEnsureVisibility(setShowGenericForm)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agende sua sessão
              </span>
            </button>
          </div>
          
          {/* WhatsApp Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a
              href={marceloWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex items-center justify-center w-full sm:w-auto gap-3 text-lg"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Falar com Marcelo</span>
            </a>
            <a
              href={nadielmaWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-accent flex items-center justify-center w-full sm:w-auto gap-3 text-lg"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Falar com Nadi</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
