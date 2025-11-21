// Servidor Express simplificado apenas para testar login
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

// Configuração do servidor
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Supabase - chave atualizada
const supabaseUrl = 'https://ygfxloachqjeslciyunr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0';

console.log('🔑 Configuração do Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 15) + '...');

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Rota de login
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔐 Tentativa de login para:', req.body.email);
    
    if (!req.body.email || !req.body.password) {
      console.error('❌ Dados de login inválidos:', { email: !!req.body.email, password: !!req.body.password });
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const { email, password } = req.body;
    console.log('🔍 Tentando autenticação com Supabase para:', email);
    
    // Criar cliente Supabase diretamente
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erro de autenticação:', error.message, error.status);
      return res.status(401).json({ error: error.message, details: error });
    }
    
    console.log('✅ Autenticação bem-sucedida para:', email);
    
    // Retornar dados da sessão e do usuário
    res.json({
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'Usuário',
        role: 'patient'
      }
    });
  } catch (error) {
    console.error('❌ Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor simplificado rodando na porta ${PORT}
📝 API endpoints:
   - GET /api/test - Testar se a API está funcionando
   - POST /api/login - Login de usuário
  `);
});
