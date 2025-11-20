import React from 'react';

const phobias = [
  { term: 'Abissofobia', definition: 'Medo de abismos, precipícios ou profundezas.' },
  { term: 'Acrofobia', definition: 'Medo de altura.' },
  { term: 'Agorafobia', definition: 'Medo de estar em espaços abertos ou em multidões, de onde seria difícil escapar.' },
  { term: 'Aracnofobia', definition: 'Medo de aranhas.' },
  { term: 'Claustrofobia', definition: 'Medo de estar em lugares fechados ou apertados.' },
  { term: 'Coulrofobia', definition: 'Medo de palhaços.' },
  { term: 'Glossofobia', definition: 'Medo de falar em público.' },
  { term: 'Hemofobia', definition: 'Medo de sangue, feridas e injeções.' },
  { term: 'Ofidiofobia', definition: 'Medo de cobras.' },
  { term: 'Tripofobia', definition: 'Medo ou aversão a padrões de furos ou buracos.' },
];

const Fobias: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-teal-800 leading-tight">
          Glossário de Fobias
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Um guia informativo sobre medos específicos e suas definições. Este glossário é um recurso para entender melhor as diversas fobias que podem ser tratadas com a terapia.
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-stone-200">
        <dl className="space-y-6">
          {phobias.map((phobia, index) => (
            <div key={index} className="relative">
              <dt>
                <p className="text-lg font-bold text-slate-800">{phobia.term}</p>
              </dt>
              <dd className="mt-1 text-slate-600">
                {phobia.definition}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Fobias;