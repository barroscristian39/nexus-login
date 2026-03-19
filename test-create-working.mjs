async function test() {
  // Step 1: Login
  console.log('1. Fazendo login...');
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'barroscristian39@gmail.com',
      senha: '12345678'
    })
  });

  const loginData = await loginRes.json();
  const token = loginData.data.token;
  console.log('✓ Login OK\n');

  // Step 2: Fetch enterprises
  console.log('2. Buscando empresas...');
  const empresasRes = await fetch('http://localhost:4000/api/empresas', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const empresasData = await empresasRes.json();
  const empresas = empresasData.data || [];
  
  if (empresas.length === 0) {
    console.log('✗ Nenhuma empresa encontrada!');
    process.exit(1);
  }

  const empresa = empresas[0];
  console.log(`✓ Encontrada empresa: ${empresa.nome} (ID: ${empresa.id})\n`);

  // Step 3: Create demand with correct empresaId
  console.log('3. Criando demanda...');
  const payload = {
    titulo: 'Demanda de Teste Trabalhat',
    descricao: 'Testando criação de demanda com empresa correta',
    prioridade: 'MEDIA',
    empresaId: empresa.id,
    vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const res = await fetch('http://localhost:4000/api/demandas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('\nStatus:', res.status);
    const text = await res.text();
    
    if (text) {
      const json = JSON.parse(text);
      console.log('Response:', JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
