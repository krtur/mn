// Teste direto de login com Supabase
// Execute com: node direct-login-test.js email senha

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - chave atualizada
const supabaseUrl = 'https://ygfxloachqjeslciyunr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Obter email e senha dos argumentos
const email = process.argv[2] || 'sotionz10@gmail.com';
const password = process.argv[3];

if (!password) {
  console.error('❌ Por favor, forneça uma senha como segundo argumento');
  console.error('Exemplo: node direct-login-test.js sotionz10@gmail.com minhasenha');
  process.exit(1);
}

// Função para testar login
async function testLogin() {
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

// Executar teste
testLogin();
