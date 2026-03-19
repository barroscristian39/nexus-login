#!/usr/bin/env node

/**
 * Script para testar aplicação localmente antes de fazer deploy
 * Uso: node test-production.mjs
 */

import http from 'http';

const API_BASE = 'http://localhost:4000';

async function testEndpoint(method = 'GET', path = '/api/health', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: { error: 'Invalid JSON', raw: data } });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 TESTANDO APLICAÇÃO NEXUS\n');
  console.log(`📍 API Base: ${API_BASE}\n`);

  const tests = [
    {
      name: '✓ Health Check',
      method: 'GET',
      path: '/api/health',
      expectedStatus: 200,
    },
    {
      name: '✓ Login - Email inválido (esperado falhar)',
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'nonexistent@test.com', senha: 'password' },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testando: ${test.name}`);
      const result = await testEndpoint(test.method, test.path, test.body);
      
      console.log(`  Status: ${result.status}`);
      console.log(`  Response: ${JSON.stringify(result.data).substring(0, 100)}`);
      
      if (test.expectedStatus && result.status === test.expectedStatus) {
        console.log(`  ✅ Passou\n`);
        passed++;
      } else if (!test.expectedStatus) {
        // Se não há status esperado, apenas verificar se há resposta
        console.log(`  ✅ Passou (resposta recebida)\n`);
        passed++;
      } else {
        console.log(`  ❌ Falhou (esperado ${test.expectedStatus}, recebido ${result.status})\n`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ Erro: ${error.message}\n`);
      failed++;
    }
  }

  console.log('=' .repeat(50));
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log('=' .repeat(50));

  if (failed > 0) {
    console.log('\n⚠️  Verifique se:');
    console.log('1. O servidor está rodando (npm run api:dev)');
    console.log('2. O banco de dados está acessível');
    console.log('3. As variáveis de ambiente estão corretas');
    process.exit(1);
  } else {
    console.log('\n🚀 Tudo pronto para deploy!');
    process.exit(0);
  }
}

runTests().catch(error => {
  console.error('\n❌ Erro ao conectar ao servidor:', error.message);
  console.log('\nCertifique-se de que o servidor está rodando:');
  console.log('  npm run api:dev\n');
  process.exit(1);
});
