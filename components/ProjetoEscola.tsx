import React from 'react';
import WhatsappIcon from './icons/WhatsappIcon';

const ProjetoEscola: React.FC = () => {
  const contactForSchool = 'https://wa.me/19981109732';
  const contactForParent = 'https://wa.me/19981109732';

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 text-center animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 leading-tight mb-2">
          Projeto Escola
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-red-600 mb-8">
          "Não deixe ser tarde demais"
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-teal-800 leading-tight">
          Cuidando da Saúde Mental no Ambiente Educacional
        </h2>
        <div className="mt-8 bg-gradient-to-r from-cyan-100 to-blue-100 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            Nós podemos ajudar
          </h3>
          <p className="text-lg text-slate-700">
            Cuidando da saúde emocional de nossas crianças e adolescentes
          </p>
        </div>

        <p className="mt-8 text-lg text-slate-600 text-left space-y-4">
          <span>
            Diante da crescente crise de saúde mental que afeta crianças e adolescentes, nosso projeto oferece um suporte essencial para o ambiente educacional. 
            Através de uma abordagem empática e especializada, trabalhamos para identificar e intervir em questões como sintomas de depressão e ansiedade, promovendo um espaço mais seguro e saudável para o desenvolvimento dos estudantes.
          </span>
          <span>
            Oferecemos palestras, workshops e atendimentos individualizados para alunos, pais e educadores, fornecendo ferramentas para lidar com os desafios emocionais do dia a dia e construir uma comunidade escolar mais resiliente e consciente.
          </span>
        </p>

        <div className="mt-12 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 rounded-lg">
          <h3 className="text-3xl font-bold mb-8">O que é TRG?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <p className="text-xl font-bold mb-2">Terapia</p>
              <p className="text-sm text-gray-300">
                O reprocessamento cognitivo trabalha o psiquismo de forma com que a pessoa não fique mais prejudicada
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold mb-2">Reprocessamento</p>
              <p className="text-sm text-gray-300">
                Destina toda a história de traumas desde o nascimento até o momento presente trabalhando também modos, anseios relacionados ao futuro
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold mb-2">Generativo</p>
              <p className="text-sm text-gray-300">
                Trabalha a capacidade de gerar novas habilidades e estratégias
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/logo.png" alt="TRG Logo" className="h-12 opacity-75" />
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 rounded-lg">
          <h3 className="text-3xl font-bold mb-8">Vantagens da TRG com a Neuroplasticidade Infanto-Juvenil</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <p className="text-gray-100">O tempo de superação a traumas é entre 8 a 12 sessões, podendo chegar a penas uma de um adulto, podendo chegar a penas uma</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <p className="text-gray-100">Aumenta em pouco tempo a capacidade de aprendizado do que o ajuda a absorver novas habilidades e estratégias</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <p className="text-gray-100">Diminui abundantemente a capacidade de desenvolver depressão, ansiedade e outros transtornos</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <p className="text-gray-100">Desenvolve maior confiança e autoestima</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <p className="text-gray-100">Aumenta a capacidade de lidar com situações estressantes e complexas</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <p className="text-gray-100">Redução de comportamentos agressivos ou violentos</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <p className="text-gray-100">Melhora a qualidade do sono</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-3xl font-bold text-teal-800 mb-8">📰 Acompanhe as Últimas Notícias</h3>
          <p className="text-slate-700 mb-8 text-center">
            Clique nos links para acessar a reportagem na íntegra
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://www.educacao.sp.gov.br/em-mapeamento-70-dos-estudantes-avaliados-relatam-sintomas-de-depressao-e-ansiedade/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-teal-200 rounded-lg p-6 hover:shadow-lg hover:border-teal-500 transition-all duration-300 text-left"
            >
              <h4 className="text-lg font-bold text-teal-800 mb-2">
                70% dos estudantes relatam sintomas de depressão e ansiedade
              </h4>
              <p className="text-slate-600 text-sm mb-3">
                Índices de saúde emocional no contexto de pandemia foram revelados em estudo desenvolvido pela Secretaria da Educação e o Instituto Ayrton Senna.
              </p>
              <span className="text-teal-600 font-semibold text-sm">Secretaria da Educação SP →</span>
            </a>

            <a
              href="https://g1.globo.com/educacao/noticia/2022/08/25/crise-de-saude-mental-nas-escolas-alunos-estao-deprimidos-ansiosos-em-luto-e-faltam-psicologos.ghtml"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-teal-200 rounded-lg p-6 hover:shadow-lg hover:border-teal-500 transition-all duration-300 text-left"
            >
              <h4 className="text-lg font-bold text-teal-800 mb-2">
                Crise de saúde mental nas escolas
              </h4>
              <p className="text-slate-600 text-sm mb-3">
                No pós-pandemia, sete em cada 10 alunos relatam sintomas de ansiedade ou depressão. Professora revela sensação de desespero e impotência ao lidar com situação.
              </p>
              <span className="text-teal-600 font-semibold text-sm">G1 Globo →</span>
            </a>

            <a
              href="https://www1.folha.uol.com.br/educacao/2022/04/69-dos-alunos-da-rede-estadual-de-sp-relatam-sintomas-de-depressao-e-ansiedade.shtml"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-teal-200 rounded-lg p-6 hover:shadow-lg hover:border-teal-500 transition-all duration-300 text-left"
            >
              <h4 className="text-lg font-bold text-teal-800 mb-2">
                69% dos alunos da rede estadual relatam sintomas
              </h4>
              <p className="text-slate-600 text-sm mb-3">
                Pesquisa ouviu 642 mil estudantes do ensino fundamental e médio da rede pública estadual de São Paulo sobre saúde mental.
              </p>
              <span className="text-teal-600 font-semibold text-sm">Folha de S.Paulo →</span>
            </a>

            <a
              href="https://saude.abril.com.br/mente-saudavel/e-urgente-trabalhar-a-saude-mental-nas-escolas/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-teal-200 rounded-lg p-6 hover:shadow-lg hover:border-teal-500 transition-all duration-300 text-left"
            >
              <h4 className="text-lg font-bold text-teal-800 mb-2">
                É urgente trabalhar a saúde mental nas escolas
              </h4>
              <p className="text-slate-600 text-sm mb-3">
                Institutos elegem dez medidas para abraçar o tema e cuidar melhor dos estudantes no país.
              </p>
              <span className="text-teal-600 font-semibold text-sm">Veja Saúde →</span>
            </a>
          </div>
        </div>
        
        <div className="mt-12 border-t border-stone-200 pt-8">
           <p className="text-xl font-semibold text-slate-700 mb-6">
            Vamos conversar sobre como podemos ajudar?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <a
              href={contactForSchool}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Quero conhecer o projeto para escola</span>
            </a>
            <a
              href={contactForParent}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
            >
              <WhatsappIcon className="w-6 h-6" />
              <span>Quero conhecer o projeto para meu filho</span>
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Atendimento: Português / English / Español
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjetoEscola;
