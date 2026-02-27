import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import WhatsappIcon from './icons/WhatsappIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import HeartIcon from './icons/HeartIcon';
import BoltIcon from './icons/BoltIcon';

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const marceloWhatsapp = 'https://wa.me/5519981109732';
  const nadielmaWhatsapp = 'https://wa.me/5519981740279';

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

  return (
    <section className="relative w-full overflow-hidden bg-transparent">
      {/* Hero Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-40 pb-20 md:pt-48 md:pb-32 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-10 animate-fade-in flex justify-center">
            <span className="inline-flex items-center px-6 py-2.5 rounded-full border border-purple-500/30 bg-purple-900/10 backdrop-blur-md text-purple-300 text-xs md:text-sm font-bold tracking-[0.2em] uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-3 animate-pulse"></span>
              Nós nos preocupamos com você!
            </span>
          </div>

          {/* Main Heading */}
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] mb-8 animate-slide-up animation-delay-100 tracking-tight text-white">
            Liberte-se dos traumas que <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-primary-400 to-purple-400">
              limitam seu potencial
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto mb-14 animate-slide-up animation-delay-200">
            Caminhando juntos em direção à sua melhor versão. <br className="hidden md:block" />
            Especialistas em Terapia de Reprocessamento Generativo (TRG).
          </p>

          {/* Key Promise Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 animate-slide-up animation-delay-250">
            <div className="flex items-center gap-2.5 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-sm hover:border-green-500/30 transition-all hover:bg-white/10">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span className="text-sm md:text-base font-medium text-slate-200">Comprovadamente Eficaz</span>
            </div>
            <div className="flex items-center gap-2.5 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-sm hover:border-blue-500/30 transition-all hover:bg-white/10">
              <BoltIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm md:text-base font-medium text-slate-200">Resultados Rápidos</span>
            </div>
            <div className="flex items-center gap-2.5 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-sm hover:border-purple-500/30 transition-all hover:bg-white/10">
              <HeartIcon className="w-5 h-5 text-purple-400" />
              <span className="text-sm md:text-base font-medium text-slate-200">Abordagem Humanizada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center px-4 py-6 md:py-0">
                <div className="text-4xl mb-4 text-purple-400">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.number}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Box Section - REPOSITIONED BELOW STATS */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="group relative bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 md:p-16 transition-all duration-500 hover:shadow-purple-900/20 hover:border-purple-500/30 max-w-4xl mx-auto overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-purple-900/20 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-900/20 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="relative z-10 flex flex-col items-center text-center gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-4">Mude sua história hoje</p>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                Transforme sua vida com a <span className="text-purple-500">TRG</span>
              </h3>
              <p className="text-lg text-slate-300 mb-2 font-medium">Metodologia comprovada para resultados profundos e duradouros.</p>
              <p className="text-sm text-slate-500">Atendimento profissional • Terapeutas certificados • Resultados garantidos</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <a href={marceloWhatsapp} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl shadow-xl hover:shadow-green-200/50 transition-all duration-300 transform hover:-translate-y-1.5 flex items-center justify-center gap-3 font-bold text-lg">
                <WhatsappIcon className="w-6 h-6" />
                <span>Falar com Marcelo</span>
              </a>
              <a href={nadielmaWhatsapp} target="_blank" rel="noopener noreferrer" className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl shadow-xl hover:shadow-primary-200/50 transition-all duration-300 transform hover:-translate-y-1.5 flex items-center justify-center gap-3 font-bold text-lg">
                <WhatsappIcon className="w-6 h-6" />
                <span>Falar com Nadi</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
              {t('benefits.title')} <span className="text-purple-500">{t('benefits.subtitle')}</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('benefits.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-3xl p-10 shadow-lg border border-white/10 hover:shadow-purple-900/20 hover:border-purple-500/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 text-purple-300">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Therapists Section */}
      <div className="relative z-10 py-32 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#0a0a0f] rounded-[3rem] shadow-2xl overflow-hidden border border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[30rem] lg:h-auto bg-slate-900">
                  <img
                    src="/terapeutas.png"
                    alt="Nossos Terapeutas - Marcelo e Nadielma"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-8 md:p-12 lg:p-20 flex flex-col justify-center">
                  <div className="mb-8 lg:mb-10">
                    <h2 className="text-3xl lg:text-5xl font-black text-white mb-2 lg:mb-4">{t('therapists.names')}</h2>
                    <p className="text-purple-400 font-bold text-xl lg:text-2xl">{t('therapists.roles')}</p>
                  </div>

                  <div className="mb-12">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Sobre os Especialistas</h4>
                    <p className="text-slate-300 leading-relaxed text-xl mb-8">
                      {t('therapists.bio')}
                    </p>
                    <div className="inline-block px-6 py-3 bg-purple-900/10 border-l-4 border-purple-500 rounded-r-lg">
                      <p className="text-purple-300 font-semibold italic text-lg">
                        "{t('therapists.specialization')}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {['Ansiedade', 'Depressão', 'Traumas', 'Fobias', 'Conflitos Emocionais'].map((tag) => (
                      <span key={tag} className="px-5 py-2 bg-white/5 text-slate-300 rounded-full text-sm font-bold hover:bg-purple-900/20 hover:text-purple-300 transition-colors cursor-default border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
