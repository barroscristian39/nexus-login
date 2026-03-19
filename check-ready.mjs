#!/usr/bin/env node

/**
 * Teste Rápido: Verifica se tudo está pronto para rodar
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n✅ CHECKLIST PRÉ-DEPLOY VERCEL\n');

const checks = [
  {
    name: 'package.json existe',
    file: 'package.json',
    test: (content) => JSON.parse(content).name,
  },
  {
    name: 'Backend server existe',
    file: 'backend/server.js',
    test: (content) => content.includes('app.listen'),
  },
  {
    name: 'Prisma schema existe',
    file: 'prisma/schema.prisma',
    test: (content) => content.includes('datasource db'),
  },
  {
    name: 'React App existe',
    file: 'src/App.tsx',
    test: (content) => content.includes('export default'),
  },
  {
    name: 'Vite config existe',
    file: 'vite.config.ts',
    test: (content) => content.includes('defineConfig'),
  },
  {
    name: 'Build script existe',
    file: 'render-build.sh',
    test: () => true,
  },
];

let passed = 0;
let failed = 0;

checks.forEach((check) => {
  const filePath = path.join(__dirname, check.file);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (check.test(content)) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`⚠️  ${check.name} (arquivo corrompido?)`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name} (não encontrado)`);
    failed++;
  }
});

console.log(`\n${passed} passos ✅ | ${failed} com problema ❌\n`);

if (failed === 0) {
  console.log('✅ TUDO PRONTO PARA RODAR!\n');
  console.log('Próximos passos:\n');
  console.log('1. LOCAL:');
  console.log('   npm run dev          (frontend em http://localhost:3000)');
  console.log('   npm run api:dev      (backend em http://localhost:4000)\n');
  console.log('2. NETLIFY:');
  console.log('   npm run build        (build para produção)\n');
  console.log('3. VERCEL (recomendado):');
  console.log('   - Vá em https://vercel.com');
  console.log('   - Conecte seu GitHub');
  console.log('   - Selecione nexus-login');
  console.log('   - Deixe Vercel configurar tudo automaticamente');
  console.log('   - Deploy automático! 🚀\n');
} else {
  console.log('⚠️  Existem problemas a resolver primeiro.\n');
}
