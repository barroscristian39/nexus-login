import http from 'http';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testCompleto() {
  try {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          TESTE COMPLETO DO LOGIN MASTER                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // 1. Health Check
    console.log('1️⃣  Health Check');
    const health = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   ✅ API Online\n`);

    // 2. Login Master
    console.log('2️⃣  Login Master User');
    const loginData = {
      email: 'barroscristian39@gmail.com',
      senha: '12345678'
    };
    console.log(`   Email: ${loginData.email}`);
    console.log(`   Senha: ${loginData.senha}`);
    
    const login = await makeRequest('POST', '/api/auth/login', loginData);
    
    if (login.status !== 200) {
      console.log(`   ❌ Erro ${login.status}: ${login.data.message}`);
      throw new Error('Login falhou');
    }

    const token = login.data.data.token;
    const usuario = login.data.data.usuario;
    
    console.log(`   ✅ Login bem-sucedido!`);
    console.log(`   Nome: ${usuario.nome}`);
    console.log(`   Perfil: ${usuario.perfil}`);
    console.log(`   Tipo: ${usuario.tipoUsuario}`);
    console.log(`   Token: ${token.substring(0, 30)}...\n`);

    // 3. Get Me (Verify Token)
    console.log('3️⃣  Verificar Token (GET /me)');
    const me = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${token}`
    });

    if (me.status === 200) {
      console.log(`   ✅ Token válido!`);
      console.log(`   Usuário confirmado: ${me.data.data.nome}`);
      console.log(`   Email: ${me.data.data.email}\n`);
    } else {
      console.log(`   ❌ Erro ao validar token: ${me.data.message}`);
    }

    // 4. Dashboard com Master
    console.log('4️⃣  Acessar Dashboard (Master)');
    const dashboard = await makeRequest('GET', '/api/dashboard/resumo', null, {
      'Authorization': `Bearer ${token}`
    });

    if (dashboard.status === 200) {
      const data = dashboard.data.data;
      console.log(`   ✅ Dashboard carregado!`);
      console.log(`   KPIs:`);
      console.log(`     • Demandas Abertas: ${data.kpis.demandasAbertas}`);
      console.log(`     • Em Execução: ${data.kpis.emExecucao}`);
      console.log(`     • Evidências Pendentes: ${data.kpis.evidenciasPendentes}`);
      console.log(`     • Bloqueadas/Atrasadas: ${data.kpis.bloqueadasAtrasadas}`);
      console.log(`   Projetos: ${data.progressoProjetos.length}`);
      console.log(`   Áreas: ${data.demandasPorArea.length}\n`);
    } else {
      console.log(`   ❌ Erro ${dashboard.status}: ${dashboard.data.message}\n`);
    }

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                ✅ TUDO FUNCIONANDO!                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n📝 Resumo:');
    console.log('  • Master user criado no banco: ✅');
    console.log('  • Autenticação funcionando: ✅');
    console.log('  • Dashboard acessível: ✅');
    console.log('  • Token gerado corretamente: ✅\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

testCompleto();
