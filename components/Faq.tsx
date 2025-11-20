import React, { useState } from 'react';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

const faqs = [
  {
    question: 'O terapeuta TRG pode atender familiares, amigos ou pessoas próximas?',
    answer: 'Sim. Diferente do código de ética da psicologia, a TRG não se baseia na fala. Como o paciente não precisa contar suas histórias, o vínculo pessoal não interfere na metodologia ou nos resultados do tratamento.'
  },
  {
    question: 'Preciso falar sobre meu trauma para ser tratado?',
    answer: 'Não. Este é um dos maiores diferenciais da TRG. O reprocessamento ocorre em um nível mais profundo do psiquismo, sem a necessidade de o paciente verbalizar os detalhes do evento traumático. Isso torna o processo mais seguro e menos doloroso.'
  },
  {
    question: 'Quantas sessões são necessárias?',
    answer: 'A TRG é conhecida por ser uma terapia breve e focada em resultados. O número de sessões varia de acordo com a complexidade da questão de cada indivíduo, mas muitos clientes relatam melhoras significativas em poucas sessões.'
  },
  {
    question: 'O que pode ser tratado com a TRG?',
    answer: 'A TRG é eficaz para uma ampla gama de questões, incluindo traumas, fobias, ansiedade, depressão, síndrome do pânico, baixa autoestima, bloqueios emocionais, compulsões e problemas de relacionamento.'
  },
  {
    question: 'A TRG é uma terapia online ou presencial?',
    answer: 'Ambos os formatos são igualmente eficazes. Oferecemos atendimentos online e presenciais para garantir flexibilidade e acesso ao tratamento, independentemente de onde você esteja.'
  }
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto">
        <QuestionMarkCircleIcon className="w-20 h-20 text-primary-600 mx-auto mb-4" />
        <h2 className="heading-secondary">
          Perguntas Frequentes
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Esclareça suas principais dúvidas sobre a Terapia de Reprocessamento Generativo.
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-stone-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-800 hover:bg-primary-50 focus:outline-none"
              aria-expanded={openIndex === index}
            >
              <span className="text-lg">{faq.question}</span>
              <ChevronDownIcon 
                className={`w-6 h-6 text-primary-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
              />
            </button>
            {openIndex === index && (
              <div className="p-5 pt-0 text-slate-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
