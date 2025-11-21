import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ygfxloachqjeslciyunr.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0';

console.log('🔑 Testando conexão com Supabase');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 10) + '...');

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para testar login
async function testLogin(email, password) {
  console.log(`🔐 Tentando login para: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Erro de autenticação:', error.message);
      console.error('Detalhes:', JSON.stringify(error, null, 2));
      return;
    }
    
    console.log('✅ Login bem-sucedido!');
    console.log('Token:', data.session.access_token.substring(0, 10) + '...');
    console.log('Usuário:', data.user.email);
    
    // Tentar buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (userError) {
      console.error('❌ Erro ao buscar dados do usuário:', userError.message);
      console.error('Detalhes:', JSON.stringify(userError, null, 2));
    } else if (userData) {
      console.log('✅ Dados do usuário:', userData);
    } else {
      console.log('⚠️ Nenhum dado de usuário encontrado');
    }
  } catch (err) {
    console.error('❌ Erro ao fazer login:', err);
  }
}

// Executar teste com as credenciais fornecidas
const email = 'sotionz10@gmail.com';
const password = process.argv[2] || 'senha-aqui'; // Forneça a senha como argumento ou substitua 'senha-aqui'

testLogin(email, password);
