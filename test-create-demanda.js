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
    
    console.log('✓ Login bem-sucedido\n');
    console.log('--- Testando Criação de Demanda ---\n');
    
    testarcriarDemanda(token);
  });
});

loginReq.on('error', (e) => console.error('Erro login:', e.message));
loginReq.write(loginData);
loginReq.end();

function testarcriarDemanda(token) {
  const demandaData = {
    titulo: 'Demanda de Teste - ' + new Date().getTime(),
    descricao: 'Descrição da demanda criada via teste automatizado',
    prioridade: 'ALTA',
    empresaId: 'cmmv9vwir000po9kwcfz8k5ar',
    status: 'ABERTA',
    progresso: 0,
    vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  console.log('Enviando:');
  console.log(JSON.stringify(demandaData, null, 2));
  console.log('\n');

  const demandaBody = JSON.stringify(demandaData);
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/demandas',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(demandaBody)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`Response Status: ${res.statusCode}`);
      console.log(`Response Body Length: ${body.length}`);
      console.log(`Response Body: ${body}`);
      
      if (body) {
        try {
          const data = JSON.parse(body);
          console.log(`✓ POST /api/demandas`);
          console.log(`  Status: ${res.statusCode}`);
          console.log(`  Success: ${data.success}`);
          if (data.data) {
            console.log(`  Demanda criada:`);
            console.log(`    ID: ${data.data.id}`);
            console.log(`    Título: ${data.data.titulo}`);
            console.log(`    Status: ${data.data.status}`);
          }
          if (data.details) {
            console.log(`  Erro: ${JSON.stringify(data.details)}`);
          }
        } catch (e) {
          console.log(`  Parse Error: ${e.message}`);
        }
      }
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.log(`✗ Erro: ${e.message}`);
    process.exit(1);
  });

  req.write(demandaBody);
  req.end();
}
