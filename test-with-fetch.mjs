// Node 18+ has native fetch
async function test() {
  // Step 1: Login
  console.log('Fazendo login...');
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

  // Step 2: Try POST
  console.log('Enviando POST para criar demanda...');
  const payload = {
    titulo: 'Teste com fetch',
    descricao: 'Testando com fetch',
    prioridade: 'MEDIA',
    empresaId: 'cmmv9vwir000po9kwcfz8k5ar'
  };

  try {
    const res = await fetch('http://localhost:4000/api/demandas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);

    if (text) {
      const json = JSON.parse(text);
      console.log('Parsed:', JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
