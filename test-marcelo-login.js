/**
 * Script de teste para login do Marcelo
 * Execute no console do navegador (F12 > Console)
 */

async function testarLoginMarcelo() {
  console.log('🧪 Iniciando teste de login do Marcelo...\n');
  
  const email = 'marcelo@mnterapeutas.com';
  const password = 'Perante@1202';
  
  try {
    // 1. Testar conexão com o servidor
    console.log('1️⃣ Testando conexão com servidor...');
    const healthCheck = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    console.log('✅ Servidor respondeu com status:', healthCheck.status);
    
    // 2. Tentar fazer login
    console.log('\n2️⃣ Tentando fazer login...');
    const loginResponse = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('❌ Erro no login:', loginData);
      console.error('Status:', loginResponse.status);
      console.error('Mensagem:', loginData.error || loginData.message);
      
      if (loginData.details) {
        console.error('Detalhes:', loginData.details);
      }
      
      return;
    }
    
    console.log('✅ Login bem-sucedido!');
    console.log('Usuário:', loginData.user);
    console.log('Token:', loginData.session.access_token.substring(0, 20) + '...');
    
    // 3. Armazenar token e testar /api/user
    console.log('\n3️⃣ Testando /api/user...');
    localStorage.setItem('token', loginData.session.access_token);
    
    const userResponse = await fetch('http://localhost:3001/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.session.access_token}`
      }
    });
    
    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('❌ Erro ao buscar dados do usuário:', userData);
      return;
    }
    
    console.log('✅ Dados do usuário obtidos:', userData);
    
    console.log('\n✅ TESTE COMPLETO - TUDO FUNCIONANDO!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    console.error('Mensagem:', error.message);
  }
}

// Executar teste
testarLoginMarcelo();
