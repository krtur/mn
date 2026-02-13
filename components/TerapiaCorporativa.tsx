import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import CheckCircleIcon from './icons/CheckCircleIcon';

const TerapiaCorporativa: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const benefits = [
    {
      title: "Resultados rápidos e positivos",
      description: "Nossas metodologias eficazes têm demonstrado resultados notáveis, ajudando pessoas a superar depressão, ansiedade, traumas e outros problemas emocionais de maneira ágil, aumentando assim a produtividade de seu time."
    },
    {
      title: "Melhoria no Bem-Estar Emocional",
      description: "Funcionários emocionalmente saudáveis são mais propensos a enfrentar desafios de forma construtiva, mantendo um ambiente de trabalho positivo."
    },
    {
      title: "Aumento da Produtividade",
      description: "A terapia ajuda a desenvolver habilidades de gerenciamento de estresse e aumento da resiliência, o que pode levar a uma maior produtividade e foco."
    },
    {
      title: "Redução do Absenteísmo",
      description: "Melhorar a saúde mental dos funcionários pode reduzir as faltas relacionadas a problemas emocionais, resultando em maior presença no trabalho."
    },
    {
      title: "Melhor Comunicação e Relações Interpessoais",
      description: "A terapia pode aprimorar as habilidades de comunicação e a capacidade de lidar com conflitos, melhorando as interações entre colegas e equipes."
    },
    {
      title: "Criação de um Ambiente de Trabalho Positivo",
      description: "Funcionários que cuidam de sua saúde mental contribuem para a construção de uma cultura organizacional saudável e acolhedora."
    },
    {
      title: "Aumento da Autoconsciência",
      description: "A terapia ajuda os funcionários a entender melhor suas emoções e comportamentos, permitindo um maior autoconhecimento e autogestão."
    },
    {
      title: "Melhoria na Tomada de Decisões",
      description: "Uma mente clara e equilibrada resulta em decisões mais informadas e eficazes por parte dos funcionários."
    },
    {
      title: "Aumento da Criatividade e Inovação",
      description: "O bem-estar emocional estimula a criatividade, levando a soluções inovadoras e novas abordagens para os desafios empresariais."
    },
    {
      title: "Redução do Estresse no Trabalho",
      description: "O bem-estar emocional estimula a criatividade, levando a soluções inovadoras e novas abordagens para os desafios empresariais."
    },
    {
      title: "Retenção e Engajamento de Funcionários",
      description: "Empresas que valorizam a saúde mental de seus funcionários tendem a ter uma maior taxa de retenção e maior engajamento por parte da equipe."
    }
  ];

  // Modal para agendamento de sessão

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 text-center animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h2 className="heading-secondary mb-4">
          {t('pages.corporateTherapy.title')}
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          {t('pages.corporateTherapy.description')}
        </p>

        <div className="mt-12 text-left grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col p-4 bg-white rounded-lg shadow-sm border-l-4 border-primary-500">
              <div className="flex items-start mb-2">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mr-3 mt-0.5" />
                <h3 className="font-bold text-slate-800">{benefit.title}</h3>
              </div>
              <p className="text-slate-600 text-sm ml-9">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={`/terapia-corporativa${num}.png`}
                  alt={`Terapia Corporativa ${num}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default TerapiaCorporativa;
