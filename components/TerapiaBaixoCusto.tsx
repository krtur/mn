import React from 'react';
import ClipboardListIcon from './icons/ClipboardListIcon';

const rules = [
  {
    title: 'Quatro (4) Atendimentos Gratuitos',
    description: 'Será oferecido quatro (4) atendimentos gratuitos. Após este período, estaremos verificando a melhor condição de pagamento de acordo com suas necessidades e condições.',
  },
  {
    title: 'Sistema de Indicação',
    description: 'A cada cliente por indicação sua, você terá um atendimento gratuito adicional.',
  },
  {
    title: 'Política de Cancelamento',
    description: 'Durante o período de atendimento gratuito não poderá ocorrer falta. Caso haja necessidade de cancelamento, deverá ser avisado com 24 horas de antecedência, assim daremos a oportunidade para outras pessoas terem o mesmo acesso.',
  },
  {
    title: 'Disciplina e Continuidade',
    description: 'No decorrer dos atendimentos gratuitos não serão permitidas faltas. Para que o tratamento tenha evolução e o atendimento não seja cancelado, é extremamente importante a sua disciplina.',
  },
];

const TerapiaBaixoCusto: React.FC = () => {
  // NOTE: This will link to the 'Anamnese (Formulário)' page or a specific sign-up form later.
  const ctaLink = '#'; 

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 text-center animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-secondary mb-2">
          Bem-vindo ao Atendimento de Baixo Custo
        </h1>
        <h2 className="heading-secondary mb-8">
          Terapia TRG Acessível para Todos
        </h2>
        
        <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-lg text-left space-y-4">
          <p className="text-lg text-slate-700">
            Na busca por promover saúde mental e bem-estar para todos, estamos felizes em oferecer um serviço de atendimento acessível de terapia para pessoas que não possuem condições financeiras para arcar com os custos totais de uma terapia particular. Reconhecemos a importância do acesso igualitário à saúde mental e estamos comprometidos em ajudar aqueles que mais precisam.
          </p>
          <p className="text-lg text-slate-700">
            Nosso programa de atendimento acessível à terapia é conduzido por profissionais dedicados e experientes, que acreditam na transformação positiva que a terapia pode trazer para a vida das pessoas. Estamos aqui para fornecer um ambiente acolhedor, seguro e confidencial.
          </p>
          <p className="text-lg text-slate-700">
            Para participar do nosso programa de atendimento acessível, solicitamos que preencha o formulário de inscrição abaixo, que permitirá o cadastro em nossa fila de espera.
          </p>
          <p className="text-lg text-slate-700">
            Valorizamos a sua coragem em buscar ajuda e estamos aqui para te apoiar. Enquanto aguarda sua vez, encorajamos você a explorar nossos recursos online, como nossas redes sociais, incluindo artigos, dicas e ferramentas úteis para cuidar de sua saúde mental. Acreditamos que todos têm o direito de receber o suporte necessário para viver uma vida plena e saudável.
          </p>
        </div>
        
        <div className="mt-12 text-left bg-white p-6 md:p-8 rounded-xl shadow-md border border-stone-200">
          <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center">Informações Importantes</h3>
          <div className="space-y-6">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <ClipboardListIcon className="w-8 h-8 text-primary-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-800">{rule.title}</h4>
                  <p className="mt-1 text-slate-600">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <a
            href={ctaLink}
            // For now, let's make it look disabled since the form isn't ready.
            className="btn-primary rounded-full"
            onClick={(e) => {
              e.preventDefault();
              alert('O formulário de inscrição será disponibilizado em breve!');
            }}
          >
            Formulário de Inscrição (Entrar na Fila de Espera)
          </a>
        </div>
      </div>
    </section>
  );
};

export default TerapiaBaixoCusto;