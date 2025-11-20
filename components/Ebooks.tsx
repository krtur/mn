import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';

const ebooks = [
  {
    title: 'Desvendando a Ansiedade: Um Guia Prático',
    description: 'Aprenda a identificar os gatilhos da ansiedade e descubra técnicas eficazes da TRG para gerenciar o estresse no dia a dia. Um material gratuito para iniciar sua jornada de bem-estar.',
    type: 'free',
    ctaText: 'Baixar eBook Gratuito',
  },
  {
    title: 'Reprocessando o Passado: O Guia Completo da TRG',
    description: 'Um aprofundamento completo na metodologia da Terapia de Reprocessamento Generativo. Este eBook pago oferece insights detalhados, estudos de caso e protocolos para quem busca uma compreensão profunda da técnica.',
    type: 'paid',
    ctaText: 'Comprar Agora',
  },
];

const Ebooks: React.FC = () => {
  const handleCtaClick = (type: 'free' | 'paid') => {
    if (type === 'free') {
      alert('Em breve, você poderá inserir seu e-mail para receber o eBook!');
    } else {
      alert('A página de vendas para este eBook estará disponível em breve!');
    }
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="heading-secondary">
          eBooks e Materiais Exclusivos
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Aprofunde seu conhecimento com nossos guias e materiais cuidadosamente elaborados para apoiar sua jornada terapêutica.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {ebooks.map((ebook, index) => (
          <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-stone-200 flex flex-col text-center">
            <div className="mx-auto mb-6">
              <BookOpenIcon className="w-24 h-24 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{ebook.title}</h3>
            <p className="mt-4 text-slate-600 flex-grow">{ebook.description}</p>
            <div className="mt-8">
              <button
                onClick={() => handleCtaClick(ebook.type as 'free' | 'paid')}
                className={`inline-block w-full px-8 py-4 font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  ebook.type === 'free'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {ebook.ctaText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Ebooks;