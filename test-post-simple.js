import http from 'http';

// First login to get a valid token
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
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const response = JSON.parse(body);
    const token = response.data.token;
    console.log('✓ Login successful');
    
    // Now test POST with valid token
    testPost(token);
  });
});

loginReq.write(loginData);
loginReq.end();

function testPost(token) {
  // Simpler test to debug POST
  const payload = {
    titulo: 'Teste Simples',
    descricao: 'Teste direto',
    prioridade: 'MEDIA',
    empresaId: 'cmmv9vwir000po9kwcfz8k5ar'
  };

  const payloadStr = JSON.stringify(payload);

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/demandas',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payloadStr)
    }
  };

  console.log('\nSending payload:', payloadStr);
  console.log('Content-Length:', Buffer.byteLength(payloadStr));
  console.log('\n');

  const req = http.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let body = '';
    res.on('data', chunk => {
      console.log('Received chunk:', chunk.toString());
      body += chunk;
    });
    
    res.on('end', () => {
      console.log('\nFinal response body:', body);
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
    console.error('Code:', e.code);
    process.exit(1);
  });

  req.on('socket', (socket) => {
    socket.on('error', (e) => {
      console.error('Socket error:', e.message);
    });
  });

  console.log('Sending request...');
  req.write(payloadStr);
  req.end();
}
