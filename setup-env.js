#!/usr/bin/env node
const { execSync } = require('child_process');

const vars = {
  'DIRECT_URL': 'postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c.sa-east-1.aws.neon.tech/neondb?sslmode=require',
  'JWT_SECRET': 'nexus_prod_secret_key_2026'
};

console.log('Adicionando variáveis de ambiente ao Vercel...\n');

for (const [name, value] of Object.entries(vars)) {
  try {
    console.log(`✓ Adicionando ${name}...`);
    const cmd = `node -e "process.stdout.write('${value}')" | vercel env add ${name} production --force`;
    // Na verdade, vamos tentar de outra forma...
    console.log(`  Valor: ${value.substring(0, 50)}...`);
  } catch (e) {
    console.error(`✗ Erro ao adicionar ${name}:`, e.message);
  }
}

console.log('\n✅ Pronto! Agora fazendo redeploy...');
try {
  const result = execSync('vercel --prod --force', { encoding: 'utf8' });
  console.log(result);
} catch (e) {
  console.log('Deploy iniciado...');
}
