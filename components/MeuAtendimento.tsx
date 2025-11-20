import React from 'react';

const MeuAtendimento: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-4">
          Conheça Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">Terapeutas</span>
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Profissionais dedicados e apaixonados por guiar você em sua jornada de autoconhecimento e cura.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Marcelo's Profile */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center md:items-start gap-6 p-8">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 shadow-md">
              <img 
                src="/marcelo.png" 
                alt="Terapeuta Marcelo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-3xl font-bold text-slate-900 text-center md:text-left">Marcelo</h3>
            <p className="text-teal-600 font-semibold mt-2 text-lg text-center md:text-left">Terapeuta e Fundador</p>
            <p className="mt-4 text-slate-700 leading-relaxed text-center md:text-left">
              Com uma abordagem empática e focada em resultados, Marcelo é especialista em Terapia de Reprocessamento Generativo (TRG). Sua missão é criar um espaço seguro onde os clientes possam explorar suas questões mais profundas, reprocessar traumas e construir uma vida mais leve e significativa.
            </p>
            <div className="mt-6">
              <h4 className="font-bold text-slate-900 mb-3 text-center md:text-left">📚 Formação e Especializações:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-teal-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Certificação Internacional em TRG (CITRG)</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-teal-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Especialização em Ansiedade e Estresse Pós-Traumático</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-teal-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Formação em Terapia Focada nas Emoções</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nadielma's Profile */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center md:items-start gap-6 p-8">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 shadow-md">
              <img 
                src="/nadielma.png" 
                alt="Terapeuta Nadielma" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-3xl font-bold text-slate-900 text-center md:text-left">Nadielma</h3>
            <p className="text-teal-600 font-semibold mt-2 text-lg text-center md:text-left">Terapeuta e Fundadora</p>
            <p className="mt-4 text-slate-700 leading-relaxed text-center md:text-left">
              Nadielma combina a TRG com uma profunda compreensão da dinâmica humana para ajudar seus clientes a superarem bloqueios emocionais e relacionais. Sua prática é pautada na compaixão e na crença de que a transformação é sempre possível.
            </p>
            <div className="mt-6">
              <h4 className="font-bold text-slate-900 mb-3 text-center md:text-left">📚 Formação e Especializações:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-teal-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Certificação Internacional em TRG (CITRG)</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-teal-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Especialização em Terapia de Casal e Família</span>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-teal-600 font-bold flex-shrink-0">✓</span>
                  <span className="text-slate-700">Pós-graduação em Neurociência e Comportamento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-200 shadow-lg p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Pronto para começar sua transformação?
        </h3>
        <p className="text-lg text-slate-600 mb-8">
          Agende uma sessão gratuita de 30 minutos com um de nossos terapeutas certificados.
        </p>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); alert('Redirecionando para agendamento...'); }}
          className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
        >
          Agende Sua Sessão Gratuita
        </a>
      </div>
    </section>
  );
};

export default MeuAtendimento;
