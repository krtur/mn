import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import QuoteIcon from './icons/QuoteIcon';

const quotes = [
  {
    author: 'Carl Gustav Jung',
    text: 'Quem olha para fora, sonha. Quem olha para dentro, desperta.'
  },
  {
    author: 'Sigmund Freud',
    text: 'Não somos apenas o que pensamos ser. Somos mais: somos também o que lembramos e aquilo de que nos esquecemos.'
  },
  {
    author: 'Carl Rogers',
    text: 'O paradoxo curioso é que quando me aceito como sou, então posso mudar.'
  },
  {
    author: 'Viktor Frankl',
    text: 'Quando não podemos mais mudar uma situação, somos desafiados a mudar a nós mesmos.'
  },
  {
    author: 'Jacques Lacan',
    text: 'O inconsciente é estruturado como uma linguagem.'
  },
  {
    author: 'B.F. Skinner',
    text: 'O que é o amor senão outro nome para o reforço positivo?'
  }
];

const Frases: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="heading-secondary">
          {t('Frase para Reflexão')}
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Citações e pensamentos de grandes figuras da psicologia para inspirar sua jornada de autoconhecimento.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quotes.map((quote, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 flex flex-col text-center transform hover:scale-105 transition-transform duration-300">
            <QuoteIcon className="w-10 h-10 text-primary-200 mx-auto mb-4" />
            <p className="text-slate-600 italic flex-grow text-lg">"{quote.text}"</p>
            <p className="mt-6 font-bold text-slate-700">- {quote.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Frases;