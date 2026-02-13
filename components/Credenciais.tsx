import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface Therapist {
  name: string;
  fullName: string;
  registro: string;
  validade: string;
  profileUrl: string;
  membershipLevel: string;
  credentialImage: string;
}

const therapists: Therapist[] = [
  {
    name: 'Nadielma',
    fullName: 'Nadielma Bezerra de Gouvea',
    registro: '04.589',
    validade: '04/2026',
    profileUrl: 'https://cbtrg.com.br/perfil/04589',
    membershipLevel: 'BLACK MEMBER',
    credentialImage: '/nadielma-credential.png',
  },
  {
    name: 'Marcelo',
    fullName: 'Marcelo Machado',
    registro: '04.137',
    validade: '03/2026',
    profileUrl: 'https://cbtrg.com.br/perfil/04137',
    membershipLevel: 'BLACK MEMBER',
    credentialImage: '/marcelo-credential.png',
  },
];

const Credenciais: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="heading-primary mb-4">
            Nossas <span className="gradient-text">Credenciais</span>
          </h2>
          <p className="text-xl text-slate-600">
            Certificação Profissional pelo CITRG
          </p>
        </div>

        {/* Informações sobre CITRG */}
        <div className="card-premium bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 p-8 md:p-12 mb-16">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">🏆</div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                O que é CITRG?
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                <strong>CITRG</strong> significa <strong>Conselho Internacional de Terapia de Reprocessamento Generativo</strong>. Esta afiliação representa um <strong>selo de qualidade e conformidade com os mais altos padrões éticos e técnicos</strong> da terapia TRG.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Nossa certificação pelo CITRG nos autoriza a realizar atendimentos em toda a <strong>Europa, América Central e América do Sul</strong>, garantindo que nossa prática é reconhecida e validada internacionalmente.
              </p>
            </div>
          </div>
        </div>

        {/* Cartões de Credenciais */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Terapeutas Certificados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {therapists.map((therapist, index) => (
              <div
                key={index}
                className="flex flex-col items-center group"
              >
                {/* Imagem do Cartão */}
                <div className="w-full mb-6 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-slate-200">
                  <img
                    src={therapist.credentialImage}
                    alt={`Credencial de ${therapist.fullName}`}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Botão de Verificação */}
                <a
                  href={therapist.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  Verificar Credencial no CITRG
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Benefícios da Certificação */}
        <div className="card-premium bg-gradient-to-r from-accent-50 to-primary-50 border-2 border-accent-200 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            ✅ O que a Certificação CITRG Garante
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">🌍</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Reconhecimento Internacional</h4>
                <p className="text-slate-700">Validade em Europa, América Central e América do Sul</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📋</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Padrões Éticos Rigorosos</h4>
                <p className="text-slate-700">Conformidade com os mais altos padrões técnicos e éticos</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Qualidade Garantida</h4>
                <p className="text-slate-700">Selo de qualidade e excelência profissional</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔍</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Transparência Total</h4>
                <p className="text-slate-700">Você pode verificar nossas credenciais a qualquer momento</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}

      </div>
    </section>
  );
};

export default Credenciais;
