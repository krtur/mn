/**
 * Configuração do Supabase
 * Cliente para integração com banco de dados PostgreSQL
 */

import { createClient } from '@supabase/supabase-js';

// Declare o tipo ImportMeta para incluir env
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

// Usar valores fixos para garantir que a chave correta seja usada
const supabaseUrl = 'https://ygfxloachqjeslciyunr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0';

// Log para debug
console.log('🔑 Supabase configurado com:', { url: supabaseUrl, key: supabaseAnonKey.substring(0, 10) + '...' });

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente Supabase não configuradas!');
  console.error('Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local');
}

// Configurar cliente com persistência de sessão
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'mn-auth-token',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Exportar auth e database para facilitar uso
export const supabaseAuth = supabase.auth;
export const supabaseDB = supabase;

// Tipos para as tabelas do Supabase
export type UserType = {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  role: 'patient' | 'therapist_a' | 'therapist_b';
  profile_image?: string;
  created_at: string;
  updated_at: string;
};

export type AppointmentType = {
  id: string;
  patient_id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type MessageType = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

export type DocumentType = {
  id: string;
  patient_id: string;
  therapist_id: string;
  type: 'report' | 'diagnosis' | 'progress_note';
  title: string;
  content: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
};

// Tipos de banco de dados (serão gerados automaticamente pelo Supabase)
export type Database = any;

// Tipos de tabelas
export interface User {
  id: string;
  email: string;
  cpf: string;
  name: string;
  phone: string;
  role: 'patient' | 'therapist_a' | 'therapist_b';
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  patient_id: string;
  therapist_id: string;
  type: 'report' | 'diagnosis' | 'progress_note';
  title: string;
  content: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

// Funções auxiliares
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

export const getSupabaseUrl = (): string => supabaseUrl;

export default supabase;
