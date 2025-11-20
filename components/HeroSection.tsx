import React from 'react';
import WhatsappIcon from './icons/WhatsappIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import HeartIcon from './icons/HeartIcon';
import BoltIcon from './icons/BoltIcon';

const HeroSection: React.FC = () => {
  // WhatsApp links for therapists
  const marceloWhatsapp = 'https://wa.me/5519981109732';
  const nadielmaWhatsapp = 'https://wa.me/5519981740279';

  const stats = [
    { number: '500+', label: 'Pacientes Transformados', icon: '👥' },
    { number: '95%', label: 'Taxa de Satisfação', icon: '⭐' },
    { number: '10+', label: 'Anos de Experiência', icon: '🎓' },
  ];

  const benefits = [
    { title: 'Resultados em Poucas Sessões', description: 'Metodologia TRG comprovada e eficaz', icon: '⚡' },
    { title: 'Abordagem Humanizada', description: 'Você é o centro do processo terapêutico', icon: '❤️' },
    { title: 'Flexibilidade de Horários', description: 'Atendimento presencial e online', icon: '🕐' },
    { title: 'Profissionalismo Garantido', description: 'Terapeutas certificados e experientes', icon: '✓' },
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
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-sm font-bold tracking-wide border border-primary-200">
              💙 NÓS NOS PREOCUPAMOS COM VOCÊ!
            </span>
          </div>

          {/* Main Heading - Disruptive */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">Liberte-se</span> dos traumas que<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600">limitam seu potencial</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed max-w-4xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Caminhando juntos em direção à sua melhor versão
          </p>

          {/* Key Promise */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Comprovadamente Eficaz</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <BoltIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Resultados Rápidos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
              <HeartIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Humanizado</span>
            </div>
          </div>

          {/* CTA Box - Premium */}
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-effect bg-gradient-to-br from-primary-50 via-accent-50 to-primary-50 rounded-3xl border-2 border-primary-200 shadow-2xl p-12 mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full opacity-10 -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Comece Agora</p>
                <p className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Transforme sua vida com <span className="gradient-text">TRG</span>
                </p>
                <p className="text-lg text-slate-600 mb-2">Metodologia comprovada para resultados duradouros</p>
                <p className="text-sm text-slate-500">Atendimento profissional • Terapeutas certificados • Resultados garantidos</p>
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
                <span>Falar com Marcelo</span>
              </a>
              <a
                href={nadielmaWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-accent flex items-center justify-center w-full sm:w-auto gap-3 text-lg"
              >
                <WhatsappIcon className="w-6 h-6" />
                <span>Falar com Nadielma</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
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
              Por que escolher <span className="gradient-text">M&N Terapeutas?</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Combinamos experiência, metodologia comprovada e humanidade para sua transformação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="card-premium p-10 hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
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
              Conheça Nossos <span className="gradient-text">Terapeutas</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Profissionais certificados internacionalmente, dedicados a sua transformação
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
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Marcelo</h3>
                  <p className="text-primary-600 font-semibold mb-3">Terapeuta e Fundador</p>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Especialista em Terapia de Reprocessamento Generativo (TRG) com certificação internacional. Sua abordagem empática e focada em resultados cria um espaço seguro para sua transformação.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">CITRG</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">Ansiedade</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">Traumas</span>
                  </div>
                </div>

                <div className="card-premium p-8 border-l-4 border-accent-500">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Nadielma</h3>
                  <p className="text-accent-600 font-semibold mb-3">Terapeuta e Fundadora</p>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Combina TRG com profunda compreensão da dinâmica humana. Sua prática é pautada na compaixão e na crença de que a transformação é sempre possível.
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
            Pronto para sua <span className="gradient-text">transformação?</span>
          </h2>
          <p className="text-xl text-slate-600 mb-16">
            Agende sua sessão com um de nossos terapeutas certificados e comece sua jornada de cura.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a
              href={marceloWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex items-center justify-center w-full sm:w-auto gap-3 text-lg"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Agendar com Marcelo</span>
            </a>
            <a
              href={nadielmaWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-accent flex items-center justify-center w-full sm:w-auto gap-3 text-lg"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Agendar com Nadielma</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
