// Knowledge base for the chatbot
export const knowledgeBase = {
  services: {
    trg: {
      name: 'Terapia de Reprocessamento Generativo (TRG)',
      description: 'Uma terapia inovadora que reprocessa traumas sem necessidade de verbalizar detalhes do evento traumático.',
      benefits: [
        'Não requer falar sobre o trauma em detalhes',
        'Reprocessamento em nível profundo do psiquismo',
        'Terapia breve e focada em resultados',
        'Eficaz para traumas, fobias, ansiedade, depressão, síndrome do pânico, baixa autoestima, bloqueios emocionais, compulsões e problemas de relacionamento'
      ],
      formats: ['Online', 'Presencial'],
      duration: 'Varia de acordo com a complexidade, mas muitos clientes relatam melhoras significativas em poucas sessões'
    },
    terapiaCorporativa: {
      name: 'Terapia Corporativa',
      description: 'Serviços de terapia para empresas e equipes corporativas.',
      target: 'Empresas e equipes'
    },
    projetoEscola: {
      name: 'Projeto Escola',
      description: 'Programa de terapia voltado para o ambiente escolar.',
      target: 'Estudantes e comunidade escolar'
    },

    mentoria: {
      name: 'Mentoria',
      description: 'Programa de mentoria para desenvolvimento pessoal e profissional.'
    }
  },
  therapists: {
    marcelo: {
      name: 'Marcelo',
      role: 'Terapeuta e Fundador',
      specializations: [
        'Certificação Internacional em TRG (CITRG)',
        'Especialização em Ansiedade e Estresse Pós-Traumático',
        'Formação em Terapia Focada nas Emoções'
      ],
      description: 'Especialista em TRG com abordagem empática e focada em resultados. Cria um espaço seguro para explorar questões profundas e reprocessar traumas.',
      whatsapp: 'https://wa.me/5519981109732'
    },
    nadielma: {
      name: 'Nadielma',
      role: 'Terapeuta e Fundadora',
      specializations: [
        'Certificação Internacional em TRG (CITRG)',
        'Especialização em Terapia de Casal e Família',
        'Pós-graduação em Neurociência e Comportamento'
      ],
      description: 'Combina TRG com profunda compreensão da dinâmica humana. Prática pautada na compaixão e na crença de que a transformação é sempre possível.',
      whatsapp: 'https://wa.me/5519981740279'
    }
  },
  faq: [
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
  ],
  generalInfo: {
    tagline: 'Expresso Terapêutico: aliviando seus traumas e te deixando mais leve a cada sessão!',
    languages: ['Português', 'Inglês', 'Espanhol']
  }
};

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const initialGreeting = `Olá! 👋 Bem-vindo à M&N Terapeutas! 

Sou o assistente virtual e estou aqui para responder suas perguntas sobre nossos serviços de terapia, terapeutas e como podemos ajudá-lo.

Como posso ajudá-lo hoje? Você pode perguntar sobre:
- 🎯 Nossos serviços de terapia
- 👥 Nossos terapeutas
- ❓ Perguntas frequentes
- 💰 Valores e promoções
- 📅 Agendamento

Qual é sua dúvida?`;
