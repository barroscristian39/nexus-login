import http from 'http';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n📤 REQUEST: ${method} ${path}`);
    if (body) console.log(`   Body:`, JSON.stringify(body));
    if (headers['Authorization']) {
      console.log(`   Auth: Bearer ${headers['Authorization'].split(' ')[1]?.substring(0, 30)}...`);
    }

    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      console.log(`📥 RESPONSE: ${res.statusCode}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`   Data:`, JSON.stringify(parsed, null, 2));
          resolve({
            status: res.statusCode,
            data: parsed,
            rawData: data
          });
        } catch {
          console.log(`   Raw:`, data);
          resolve({
            status: res.statusCode,
            data,
            rawData: data
          });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ ERROR:`, e.message);
      reject(e);
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testSenior() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         TESTE SENIOR DO MASTER USER - DEBUGGING            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // 1. Verificar dados de entrada
    console.log('\n═══ PASSO 1: Dados de Entrada ═══');
    const loginPayload = {
      email: 'barroscristian39@gmail.com',
      senha: '12345678'
    };
    console.log('Email:', loginPayload.email);
    console.log('Senha:', loginPayload.senha);
    console.log('Email contém @?', loginPayload.email.includes('@'));

    // 2. Fazer login
    console.log('\n═══ PASSO 2: Fazer Login ═══');
    const login = await makeRequest('POST', '/api/auth/login', loginPayload);
    
    if (login.status !== 200) {
      console.log(`❌ FALHA NO LOGIN: ${login.status}`);
      console.log(`   Mensagem: ${login.data.message}`);
      throw new Error(`Login retornou ${login.status}`);
    }

    console.log('✅ LOGIN BEM-SUCEDIDO');
    
    const token = login.data.data?.token;
    if (!token) {
      throw new Error('Token não retornado!');
    }

    // 3. Decodificar JWT manualmente
    console.log('\n═══ PASSO 3: Analisar JWT ═══');
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Token JWT inválido (não tem 3 partes)');
    }

    try {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('Payload do token:');
      console.log('  id:', payload.id);
      console.log('  perfil:', payload.perfil);
      console.log('  empresaId:', payload.empresaId);
      console.log('  tipoUsuario:', payload.tipoUsuario);
      console.log('  iat:', new Date(payload.iat * 1000));
      console.log('  exp:', new Date(payload.exp * 1000));
      
      if (payload.perfil !== 'MASTER') {
        console.log('⚠️  AVISO: Token não contém MASTER!');
      }
    } catch (e) {
      console.log('❌ Erro ao decodificar JWT:', e.message);
    }

    // 4. Testar GET /me
    console.log('\n═══ PASSO 4: Verificar Token (GET /me) ═══');
    const me = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${token}`
    });

    if (me.status !== 200) {
      console.log(`❌ FALHA: ${me.status}`);
      throw new Error(`GET /me falhou com ${me.status}`);
    }

    console.log('✅ TOKEN VÁLIDO');
    console.log('   Usuário:', me.data.data?.nome);
    console.log('   Email:', me.data.data?.email);
    console.log('   Perfil:', me.data.data?.perfil);

    // 5. Testar Dashboard
    console.log('\n═══ PASSO 5: Acessar Dashboard ═══');
    const dashboard = await makeRequest('GET', '/api/dashboard/resumo', null, {
      'Authorization': `Bearer ${token}`
    });

    if (dashboard.status !== 200) {
      console.log(`❌ FALHA: ${dashboard.status}`);
      console.log(`   Mensagem: ${dashboard.data.message}`);
      throw new Error(`Dashboard falhou com ${dashboard.status}`);
    }

    console.log('✅ DASHBOARD ACESSADO');
    console.log('   KPIs:', Object.keys(dashboard.data.data.kpis).length);

    // 6. Conclusão
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ TUDO FUNCIONANDO!                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n✅ Master user:');
    console.log('   Email: barroscristian39@gmail.com');
    console.log('   Status: ATIVO NO BANCO');
    console.log('   Autenticação: ✅');
    console.log('   Token JWT: ✅');
    console.log('   Dashboard: ✅');

  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    process.exit(1);
  }
}

testSenior();
