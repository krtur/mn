import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dirname } from 'path';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar dotenv
dotenv.config();

// Configuração do servidor
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Configuração do Supabase
const supabaseUrl = 'https://ygfxloachqjeslciyunr.supabase.co';
// Chave anônima atualizada - esta é a chave pública, não há problema em expô-la no código
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0';

console.log('🔑 Configuração do Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 15) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rotas de API
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔐 Tentativa de login para:', req.body.email);
    
    if (!req.body.email || !req.body.password) {
      console.error('❌ Dados de login inválidos:', { email: !!req.body.email, password: !!req.body.password });
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const { email, password } = req.body;
    console.log('🔍 Tentando autenticação com Supabase para:', email);
    
    // Usar createClient diretamente para garantir que estamos usando as credenciais corretas
    const authClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { auth: { persistSession: false } }
    );
    
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erro de autenticação:', error.message, error.status);
      return res.status(401).json({ error: error.message, details: error });
    }
    
    console.log('✅ Autenticação bem-sucedida para:', email);

    console.log('✅ Login bem-sucedido para:', email);
    
    // Buscar dados do usuário
    let userData = null;
    try {
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (userError) {
        console.warn('⚠️ Erro ao buscar dados do usuário:', userError.message);
        console.error('❌ ERRO CRÍTICO: Não foi possível carregar dados do usuário do banco de dados!');
        console.error('   Isso pode causar problemas de segurança. Verifique as políticas RLS do Supabase.');
        // Não retornar dados incompletos - forçar erro
        return res.status(500).json({ 
          error: 'Erro ao carregar dados do usuário. Verifique as políticas RLS do Supabase.',
          details: userError.message
        });
      } else if (userRecord) {
        console.log('✅ Dados do usuário carregados:', userRecord.name, '- Role:', userRecord.role);
        userData = userRecord;
      }
    } catch (userDataError) {
      console.error('❌ Erro ao carregar dados do usuário:', userDataError);
      return res.status(500).json({ 
        error: 'Erro ao carregar dados do usuário',
        details: userDataError.message
      });
    }

    // Retornar dados da sessão e do usuário
    res.json({
      session: data.session,
      user: userData
    });
  } catch (error) {
    console.error('❌ Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('❌ Erro ao verificar token:', error?.message || 'Usuário não encontrado');
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (userError) {
      console.warn('⚠️ Erro ao buscar dados do usuário:', userError.message);
      // Usar dados básicos do Auth
      return res.json({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'Usuário',
        role: 'patient',
        therapist_id: null
      });
    }
    
    console.log('✅ Dados do usuário retornados:', userData.name);
    res.json(userData);
  } catch (error) {
    console.error('❌ Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Erro ao fazer logout:', error.message);
      return res.status(500).json({ error: error.message });
    }
    console.log('✅ Logout bem-sucedido');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para todas as outras requisições (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor rodando na porta ${PORT}
📝 API endpoints:
   - POST /api/login - Login de usuário
   - GET /api/user - Dados do usuário autenticado
   - POST /api/logout - Logout de usuário
  `);
});
