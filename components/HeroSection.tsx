import React from 'react';
import WhatsappIcon from './icons/WhatsappIcon';

const HeroSection: React.FC = () => {
  // NOTE: Replace these placeholder phone numbers with the actual international format numbers.
  const marceloWhatsapp = 'https://wa.me/5500000000000';
  const nadielmaWhatsapp = 'https://wa.me/5500000000001';

  return (
    <section className="container mx-auto px-4 py-20 md:py-32 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold tracking-wide mb-6">
            ✨ BEM-VINDO À M&N TERAPEUTAS
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Caminhando juntos em direção à sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">melhor versão</span>
        </h2>
        <p className="mt-6 text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
          Expresso Terapêutico: aliviando seus traumas e te deixando mais leve a cada sessão!
        </p>
        <div className="mt-16">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-200 shadow-lg p-8 mb-10">
            <p className="text-xl md:text-2xl font-semibold text-slate-800">
              🎁 Agende agora 30 minutos de sessão <span className="text-teal-700 font-bold">GRÁTIS</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
            <a
              href={marceloWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Terapeuta Marcelo</span>
            </a>
            <a
              href={nadielmaWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Terapeuta Nadielma</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
