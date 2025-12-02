import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export const TestRequestForm: React.FC = () => {
  const [name, setName] = useState('Visitante Teste');
  const [email, setEmail] = useState('visitante@teste.com');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [therapistId, setTherapistId] = useState('028d8869-679f-4093-b435-1a43b6ced0e2'); // Marcelo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Enviando solicitação direta para o Supabase');
      console.log('Dados:', { name, email, phone, therapist_id: therapistId, status: 'pending' });

      const { data, error: insertError } = await supabase
        .from('new_client_requests')
        .insert([
          { name, email, phone, therapist_id: therapistId, status: 'pending' }
        ])
        .select();

      if (insertError) {
        console.error('Erro ao inserir solicitação:', insertError);
        console.error('Código:', insertError.code);
        console.error('Mensagem:', insertError.message);
        console.error('Detalhes:', insertError.details);
        throw insertError;
      }

      console.log('Solicitação criada com sucesso:', data);
      setSuccess(true);
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      setError(`Erro: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
        <p className="font-medium">Solicitação enviada com sucesso!</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg"
        >
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Teste de Solicitação Direta</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="test-name" className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
          <input
            id="test-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            placeholder="Digite seu nome completo"
            title="Nome completo"
            required
          />
        </div>
        
        <div>
          <label htmlFor="test-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            placeholder="seu.email@exemplo.com"
            title="Endereço de e-mail"
            required
          />
        </div>
        
        <div>
          <label htmlFor="test-phone" className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
          <input
            id="test-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            placeholder="(00) 00000-0000"
            title="Número de telefone com DDD"
            required
          />
        </div>
        
        <div>
          <label htmlFor="test-therapist" className="block text-sm font-medium text-slate-700 mb-1">Terapeuta</label>
          <select
            id="test-therapist"
            value={therapistId}
            onChange={(e) => setTherapistId(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            title="Selecione o terapeuta"
            required
          >
            <option value="028d8869-679f-4093-b435-1a43b6ced0e2">Marcelo</option>
            <option value="83273ffc-c878-4abc-a24b-e35fd4801339">Nadielma</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitação Direta'}
        </button>
      </form>
    </div>
  );
};
