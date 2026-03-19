import fetch from 'node-fetch';

console.log('🧪 Testando autenticação corrigida...\n');

async function testarAutenticacao() {
  try {
    console.log('1️⃣ TESTANDO LOGIN\n');
    
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'barroscristian39@gmail.com',
        senha: '12345678'
      })
    });

    const loginData = await loginResponse.json();
    
    console.log(`Status: ${loginResponse.status}`);
    console.log(`Resposta:`, JSON.stringify(loginData, null, 2));

    if (!loginResponse.ok) {
      console.log('\n❌ Erro no login!');
      return;
    }

    const token = loginData.data.token;
    console.log(`\n✅ Token gerado com sucesso!`);
    console.log(`Token: ${token.substring(0, 50)}...`);

    console.log('\n2️⃣ TESTANDO VALIDAÇÃO DE TOKEN (GET /me)\n');

    const meResponse = await fetch('http://localhost:4000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const meData = await meResponse.json();
    
    console.log(`Status: ${meResponse.status}`);
    console.log(`Resposta:`, JSON.stringify(meData, null, 2));

    if (meResponse.ok) {
      console.log('\n✅ AUTENTICAÇÃO FUNCIONANDO CORRETAMENTE!');
      console.log(`   Usuário autenticado: ${meData.data.nome}`);
      console.log(`   Perfil: ${meData.data.perfil}`);
      console.log(`   Email: ${meData.data.email}`);
    } else {
      console.log('\n❌ Erro ao validar token!');
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testarAutenticacao();
