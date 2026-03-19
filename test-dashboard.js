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

async function test() {
  try {
    console.log('=== Testando Dashboard ===\n');

    // 1. Health check
    console.log('1. Verificando API...');
    const health = await makeRequest('GET', '/api/health');
    console.log('Status:', health.status);
    console.log('Resposta:', health.data, '\n');

    // 2. Login
    console.log('2. Fazendo login...');
    const login = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@nexus.com.br',
      senha: 'admin123'
    });
    console.log('Status:', login.status);
    console.log('Resposta:', login.data);
    
    if (!login.data.data?.token) {
      console.log('\n❌ Erro: Token não retornado. Tentando outro usuário...');
      
      // Tenta com outro email
      const login2 = await makeRequest('POST', '/api/auth/login', {
        email: 'carlos@nexus.com',
        senha: 'nexus123'
      });
      console.log('Status:', login2.status);
      console.log('Resposta:', login2.data);
      
      if (!login2.data.data?.token) {
        throw new Error('Nenhum token disponível');
      }
      
      var token = login2.data.data.token;
    } else {
      var token = login.data.data.token;
    }
    
    console.log('Token obtido:', token?.substring(0, 20) + '...', '\n');

    // 3. Dashboard
    console.log('3. Buscando dados do dashboard...');
    const dashboard = await makeRequest('GET', '/api/dashboard/resumo', null, {
      'Authorization': `Bearer ${token}`
    });
    console.log('Status:', dashboard.status);
    console.log('Resposta:', JSON.stringify(dashboard.data, null, 2));

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

test();
