import React, { useState, useRef, useEffect } from 'react';
import { knowledgeBase, Message, initialGreeting } from './chatbotData';
import SendIcon from './icons/SendIcon';
import XIcon from './icons/XIcon';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: initialGreeting,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for greetings
    if (lowerMessage.match(/oi|olá|opa|e aí|tudo bem|opa/i)) {
      return 'Olá! 👋 Como posso ajudá-lo? Tem alguma dúvida sobre nossos serviços de terapia?';
    }

    // Check for service-related questions
    if (lowerMessage.match(/serviço|terapia|o que vocês oferecem|qual é o serviço/i)) {
      return `Oferecemos vários serviços:

1. **Terapia de Reprocessamento Generativo (TRG)** - Nossa especialidade! Uma terapia inovadora que reprocessa traumas sem necessidade de verbalizar detalhes do evento traumático.

2. **Terapia Corporativa** - Serviços para empresas e equipes.

3. **Projeto Escola** - Programa voltado para o ambiente escolar.

4. **Terapia de Baixo Custo** - Sessões com valores acessíveis.

5. **Mentoria** - Desenvolvimento pessoal e profissional.

Qual desses serviços você gostaria de conhecer melhor?`;
    }

    // Check for TRG-specific questions
    if (lowerMessage.match(/trg|reprocessamento generativo|como funciona|como é a terapia/i)) {
      return `A **Terapia de Reprocessamento Generativo (TRG)** é uma abordagem revolucionária que:

✨ **Não requer falar sobre o trauma** - O reprocessamento ocorre em um nível mais profundo do psiquismo, sem necessidade de verbalizar detalhes do evento traumático.

✨ **É breve e focada em resultados** - Muitos clientes relatam melhoras significativas em poucas sessões.

✨ **Trata múltiplos problemas** - Traumas, fobias, ansiedade, depressão, síndrome do pânico, baixa autoestima, bloqueios emocionais, compulsões e problemas de relacionamento.

✨ **Oferecemos online e presencial** - Ambos os formatos são igualmente eficazes.

Tem mais alguma dúvida sobre a TRG?`;
    }

    // Check for therapist questions
    if (lowerMessage.match(/terapeuta|marcelo|nadielma|quem são|conhecer os terapeutas/i)) {
      return `Temos dois terapeutas incríveis:

👨‍⚕️ **Marcelo** - Terapeuta e Fundador
- Certificação Internacional em TRG (CITRG)
- Especialização em Ansiedade e Estresse Pós-Traumático
- Formação em Terapia Focada nas Emoções
- Abordagem empática e focada em resultados

👩‍⚕️ **Nadielma** - Terapeuta e Fundadora
- Certificação Internacional em TRG (CITRG)
- Especialização em Terapia de Casal e Família
- Pós-graduação em Neurociência e Comportamento
- Prática pautada na compaixão

Quer agendar uma sessão com um deles?`;
    }

    // Check for pricing/free session
    if (lowerMessage.match(/preço|valor|custa|quanto|grátis|sessão gratuita|free/i)) {
      return `💼 **Investimento em sua saúde mental** - Oferecemos atendimento profissional com terapeutas certificados internacionalmente.

Para conhecer melhor nossos serviços e valores:
- Converse com um de nossos terapeutas
- Eles podem responder todas suas dúvidas
- Agende uma consulta profissional

Qual terapeuta você prefere?`;
    }

    // Check for FAQ questions
    if (lowerMessage.match(/falar sobre trauma|preciso contar|verbalizar|falar detalhes/i)) {
      return `**Não!** Este é um dos maiores diferenciais da TRG. 

O reprocessamento ocorre em um nível mais profundo do psiquismo, sem a necessidade de você verbalizar os detalhes do evento traumático. Isso torna o processo muito mais seguro e menos doloroso.

Você não precisa contar sua história se não quiser! 🙏`;
    }

    if (lowerMessage.match(/familiar|amigo|pessoa próxima|vínculo pessoal/i)) {
      return `**Sim!** O terapeuta TRG pode atender familiares, amigos ou pessoas próximas.

Diferente do código de ética da psicologia, a TRG não se baseia na fala. Como o paciente não precisa contar suas histórias, o vínculo pessoal não interfere na metodologia ou nos resultados do tratamento.

Então fique à vontade para indicar nossos serviços para quem você ama! ❤️`;
    }

    if (lowerMessage.match(/quantas sessões|quanto tempo|duração|sessões necessárias/i)) {
      return `O número de sessões varia de acordo com a complexidade da questão de cada indivíduo.

Porém, a TRG é conhecida por ser uma **terapia breve e focada em resultados**. Muitos clientes relatam **melhoras significativas em poucas sessões**!

Na sua primeira sessão, nossos terapeutas podem avaliar melhor seu caso e dar uma estimativa mais precisa.`;
    }

    if (lowerMessage.match(/online|presencial|formato|onde/i)) {
      return `**Ambos os formatos são igualmente eficazes!** 🌍

Oferecemos:
- ✅ **Atendimentos Online** - Flexibilidade de qualquer lugar
- ✅ **Atendimentos Presenciais** - Contato direto com o terapeuta

Escolha o formato que melhor se adequa à sua rotina!`;
    }

    // Check for contact/scheduling
    if (lowerMessage.match(/agendar|marcar|contato|whatsapp|ligar|falar com|conversar/i)) {
      return `Perfeito! 🎯 Você está pronto para começar sua transformação?

Temos dois terapeutas incríveis disponíveis:

**Marcelo** - Clique no link abaixo para conversar no WhatsApp:
https://wa.me/5519981109732

**Nadielma** - Clique no link abaixo para conversar no WhatsApp:
https://wa.me/5519981740279

Nossos terapeutas certificados estão prontos para ajudá-lo!

Qual terapeuta você prefere?`;
    }

    // Check for general questions about the company
    if (lowerMessage.match(/m&n|sobre vocês|quem são|empresa|missão|visão/i)) {
      return `Bem-vindo à **M&N Terapeutas**! 👋

Somos uma clínica de terapia especializada em **Terapia de Reprocessamento Generativo (TRG)** - uma metodologia inovadora que transforma vidas.

🎯 **Nossa Missão:** Aliar você em sua jornada de autoconhecimento e cura, deixando você mais leve a cada sessão.

📍 **Nosso Diferencial:** Oferecemos terapia breve, focada em resultados, sem necessidade de verbalizar traumas.

🌍 **Idiomas:** Português, Inglês e Espanhol.

Quer conhecer mais sobre nossos serviços?`;
    }

    // Check for fobias
    if (lowerMessage.match(/fobia|medo|pânico|ansiedade/i)) {
      return `A TRG é **altamente eficaz** para fobias, medos e ansiedade! 🎯

Muitos clientes relatam alívio significativo em poucas sessões, sem necessidade de enfrentar o medo diretamente.

A terapia reprocessa o trauma ou medo em um nível profundo, permitindo que você viva sem limitações.

Quer conversar com um de nossos terapeutas sobre seu caso específico?`;
    }

    // Default response
    return `Entendi sua pergunta! 😊 

Infelizmente, não tenho informação específica sobre isso. Mas nossos terapeutas podem responder com muito mais detalhes!

Você gostaria de:
1. **Agendar uma sessão** para conversar com um terapeuta
2. **Fazer outra pergunta** sobre nossos serviços

O que prefere?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-40 border-4 border-white"
        title="Abrir chat"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">M&N Terapeutas</h3>
              <p className="text-sm text-primary-100">Assistente Virtual</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-primary-700 rounded-full transition-colors"
              title="Fechar chat"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-500 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 border border-stone-200 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce-delay-100"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce-delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-stone-200 p-4 bg-white">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="flex-1 px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-stone-300 transition-colors flex items-center justify-center"
                title="Enviar mensagem"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
