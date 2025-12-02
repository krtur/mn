import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface DirectApiFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  preselectedTherapist?: string;
  isModal?: boolean;
}

const DirectApiForm: React.FC<DirectApiFormProps> = ({ 
  onSuccess, 
  onCancel, 
  preselectedTherapist,
  isModal = false
}) => {
  // Estados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [therapistId, setTherapistId] = useState(preselectedTherapist || '');
  
  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Lista de terapeutas
  const therapists = [
    { id: '83273ffc-c878-4abc-a24b-e35fd4801339', name: 'Nadielma' },
    { id: '028d8869-679f-4093-b435-1a43b6ced0e2', name: 'Marcelo' }
  ];

  // Validar formulário
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um e-mail válido.');
      return false;
    }
    
    if (!phone.trim() || phone.length < 10) {
      setError('Por favor, informe um telefone válido com DDD.');
      return false;
    }
    
    if (!therapistId) {
      setError('Por favor, selecione um terapeuta.');
      return false;
    }
    
    return true;
  };

  // Formatar telefone
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Lidar com mudança no telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
  };

  // Enviar formulário usando fetch diretamente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Enviando solicitação via cliente Supabase');
      console.log('Dados:', { name, email, phone, therapist_id: therapistId });
      
      // Usar o cliente Supabase diretamente
      const { data, error } = await supabase
        .from('new_client_requests')
        .insert([
          {
            name,
            email,
            phone,
            therapist_id: therapistId,
            status: 'pending'
          }
        ])
        .select();
      
      if (error) {
        console.error('Erro ao inserir solicitação:', error);
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);
        console.error('Detalhes:', error.details);
        throw new Error(`Erro ao inserir solicitação: ${error.message}`);
      }
      
      console.log('Solicitação criada com sucesso:', data);
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      
      // Limpar formulário
      setName('');
      setEmail('');
      setPhone('');
      
      // Chamar callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      setError(`Não foi possível enviar sua solicitação: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar formulário de sucesso
  if (success) {
    return (
      <div className={`${isModal ? 'p-6' : 'p-8 card-premium rounded-xl shadow-lg max-w-md mx-auto'}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Solicitação Enviada!</h3>
          <p className="text-slate-600 mb-6">
            Obrigado pelo seu interesse! O terapeuta entrará em contato em breve para agendar sua primeira consulta.
          </p>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    );
  }

  // Renderizar formulário
  return (
    <div className={`${isModal ? 'p-6' : 'p-8 card-premium rounded-xl shadow-lg max-w-md mx-auto'}`}>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {preselectedTherapist ? 'Agende Sua Sessão (API Direta)' : 'Agende Sua Primeira Sessão (API Direta)'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Seu nome completo"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="seu.email@exemplo.com"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {/* Telefone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="(00) 00000-0000"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {/* Terapeuta */}
          {!preselectedTherapist && (
            <div>
              <label htmlFor="therapist" className="block text-sm font-medium text-slate-700 mb-1">
                Terapeuta
              </label>
              <select
                id="therapist"
                value={therapistId}
                onChange={(e) => setTherapistId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={isSubmitting}
                required
              >
                <option value="">Selecione um terapeuta</option>
                {therapists.map((therapist) => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Botões */}
          <div className="flex gap-4 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className={`flex-1 px-6 py-3 ${
                preselectedTherapist === '83273ffc-c878-4abc-a24b-e35fd4801339'
                  ? 'bg-accent-600 hover:bg-accent-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-white rounded-lg transition-colors flex items-center justify-center`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Solicitar Agendamento (API Direta)'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DirectApiForm;
