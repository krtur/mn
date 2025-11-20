import React from 'react';

const MeuAtendimento: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h2 className="heading-primary mb-6">
          Conheça Nossos <span className="gradient-text">Terapeutas</span>
        </h2>
        <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
          Profissionais dedicados e apaixonados por guiar você em sua jornada de autoconhecimento e cura.
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
            <h3 className="text-3xl font-bold text-slate-900 text-center md:text-left">Marcelo</h3>
            <p className="text-primary-600 font-semibold mt-2 text-lg text-center md:text-left">Terapeuta e Fundador</p>
            <p className="mt-4 text-slate-700 leading-relaxed text-center md:text-left">
              Com uma abordagem empática e focada em resultados, Marcelo é especialista em Terapia de Reprocessamento Generativo (TRG). Sua missão é criar um espaço seguro onde os clientes possam explorar suas questões mais profundas, reprocessar traumas e construir uma vida mais leve e significativa.
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
            <h3 className="text-3xl font-bold text-slate-900 text-center md:text-left">Nadielma</h3>
            <p className="text-accent-600 font-semibold mt-2 text-lg text-center md:text-left">Terapeuta e Fundadora</p>
            <p className="mt-4 text-slate-700 leading-relaxed text-center md:text-left">
              Nadielma combina a TRG com uma profunda compreensão da dinâmica humana para ajudar seus clientes a superarem bloqueios emocionais e relacionais. Sua prática é pautada na compaixão e na crença de que a transformação é sempre possível.
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
          Pronto para começar sua transformação?
        </h3>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          Agende uma sessão com um de nossos terapeutas certificados internacionalmente.
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
