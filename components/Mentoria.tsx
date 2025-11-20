import React from 'react';
import AcademicCapIcon from './icons/AcademicCapIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import WhatsappIcon from './icons/WhatsappIcon';

const Mentoria: React.FC = () => {
  const ctaLink = 'https://wa.me/5500000000000'; // Placeholder contact number

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-teal-800 leading-tight">
          Programa de Mentoria para Terapeutas
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Eleve sua prática terapêutica a um novo patamar com a nossa mentoria especializada em Terapia de Reprocessamento Generativo (TRG).
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center mb-4">
            <AcademicCapIcon className="w-10 h-10 text-teal-600 mr-4"/>
            <h3 className="text-2xl font-bold text-slate-700">Para Quem é a Mentoria?</h3>
          </div>
          <p className="text-slate-600">
            Este programa é desenhado para terapeutas, psicólogos e estudantes de psicologia que desejam aprofundar seus conhecimentos em TRG, ganhar confiança clínica e acelerar o desenvolvimento de suas carreiras. Ideal para profissionais que buscam supervisão de casos, aprimoramento de técnicas e uma base sólida para construir uma prática de sucesso.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
           <div className="flex items-center mb-4">
            <LightBulbIcon className="w-10 h-10 text-yellow-500 mr-4"/>
            <h3 className="text-2xl font-bold text-slate-700">Como Funciona?</h3>
          </div>
          <p className="text-slate-600">
            A mentoria é um processo colaborativo e personalizado. Através de encontros online (individuais ou em grupo), oferecemos supervisão direta de casos clínicos, discussão de protocolos da TRG, e orientação prática sobre os desafios do dia a dia do terapeuta. O foco é no seu crescimento profissional, ajudando a refinar suas habilidades e a oferecer resultados ainda mais eficazes para seus pacientes.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
         <p className="text-xl font-semibold text-slate-700 mb-6">
            Interessado em transformar sua carreira?
          </p>
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-teal-600 text-white font-bold rounded-full shadow-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105"
        >
          <WhatsappIcon className="w-6 h-6" />
          <span>Saiba Mais e Aplique</span>
        </a>
      </div>
    </section>
  );
};

export default Mentoria;