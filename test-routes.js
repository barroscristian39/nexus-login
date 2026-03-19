import http from 'http';

// Step 1: Login
const loginData = JSON.stringify({
  email: 'barroscristian39@gmail.com',
  senha: '12345678'
});

const loginOptions = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const response = JSON.parse(body);
    const token = response.data.token;
    
    console.log('✓ Login bem-sucedido');
    console.log('Token:', token.substring(0, 30) + '...');
    console.log('\n--- Testando Rotas ---\n');
    
    testRota('/api/demandas', token, () => {
      testRota('/api/projetos', token, () => {
        testRota('/api/empresas', token, () => {
          testRota('/api/evidencias', token, () => {
            process.exit(0);
          });
        });
      });
    });
  });
});

loginReq.on('error', (e) => console.error('Erro login:', e.message));
loginReq.write(loginData);
loginReq.end();

function testRota(path, token, callback) {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: path,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const data = JSON.parse(body);
      console.log(`✓ GET ${path}`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Itens: ${(data.data || []).length}`);
      console.log(`  Success: ${data.success}`);
      console.log('');
      callback();
    });
  });
  
  req.on('error', (e) => {
    console.log(`✗ GET ${path}`);
    console.log(`  Erro: ${e.message}`);
    console.log('');
    callback();
  });
  req.end();
}
