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
    console.log('\n--- Testando Operações de Demandas ---\n');
    
    // Primeiro, vamos pegar o ID da demanda
    testRota('/api/demandas', token, 'GET', null, (demandasResponse) => {
      const demandas = JSON.parse(demandasResponse).data;
      if (demandas.length > 0) {
        const demandaId = demandas[0].id;
        console.log(`\nDemanda ID: ${demandaId}\n`);
        
        // Testar atualizar status
        testarUpdateStatus(demandaId, token, () => {
          // Testar PUT (edição)
          testarUpdateDemanda(demandaId, token, () => {
            process.exit(0);
          });
        });
      } else {
        console.log('Nenhuma demanda encontrada para testar');
        process.exit(0);
      }
    });
  });
});

loginReq.on('error', (e) => console.error('Erro login:', e.message));
loginReq.write(loginData);
loginReq.end();

function testRota(path, token, method, body, callback) {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: path,
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.headers['Content-Length'] = JSON.stringify(body).length;
  }
  
  const req = http.request(options, (res) => {
    let respBody = '';
    res.on('data', chunk => respBody += chunk);
    res.on('end', () => {
      callback(respBody);
    });
  });
  
  req.on('error', (e) => {
    console.log(`✗ ${method} ${path}`);
    console.log(`  Erro: ${e.message}`);
    callback(null);
  });
  
  if (body) {
    req.write(JSON.stringify(body));
  }
  req.end();
}

function testarUpdateStatus(demandaId, token, callback) {
  const statusData = { status: 'EM_ANDAMENTO' };
  console.log(`Testando PATCH /api/demandas/${demandaId}/status`);
  
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: `/api/demandas/${demandaId}/status`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(statusData).length
    }
  };
  
  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`✓ Status: ${res.statusCode}`);
      const data = JSON.parse(body);
      console.log(`  Sucesso: ${data.success}`);
      console.log(`  Novo Status: ${data.data?.status}\n`);
      callback();
    });
  });
  
  req.on('error', (e) => {
    console.log(`✗ Erro: ${e.message}\n`);
    callback();
  });
  
  req.write(JSON.stringify(statusData));
  req.end();
}

function testarUpdateDemanda(demandaId, token, callback) {
  const updateData = {
    titulo: 'Demanda Atualizada via API',
    descricao: 'Descrição atualizada',
    prioridade: 'ALTA',
    progresso: 50
  };
  
  console.log(`Testando PUT /api/demandas/${demandaId}`);
  
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: `/api/demandas/${demandaId}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(updateData).length
    }
  };
  
  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`✓ Status: ${res.statusCode}`);
      const data = JSON.parse(body);
      console.log(`  Sucesso: ${data.success}`);
      console.log(`  Novo Título: ${data.data?.titulo}\n`);
      callback();
    });
  });
  
  req.on('error', (e) => {
    console.log(`✗ Erro: ${e.message}\n`);
    callback();
  });
  
  req.write(JSON.stringify(updateData));
  req.end();
}
