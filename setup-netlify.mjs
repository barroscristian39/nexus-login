#!/usr/bin/env node

/**
 * Script para configurar deploy após obter URL do Render
 * 
 * Instruções:
 * 1. Após deploy no Render, você receberá uma URL como: https://nexus-api-abcd1234.onrender.com
 * 2. Edite a variável BACKEND_URL abaixo com essa URL
 * 3. Execute este script: node setup-netlify.mjs
 * 4. Siga as instruções para configurar no Netlify
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ⚠️ EDITE ISSO COM A URL DO SEU RENDER
const BACKEND_URL = 'https://seu-backend-url.onrender.com'; // ← SUBSTITUA AQUI

if (BACKEND_URL === 'https://seu-backend-url.onrender.com') {
  console.log('\n❌ ERRO: Você precisa definir BACKEND_URL\n');
  console.log('Edite este arquivo e substitua:');
  console.log('   BACKEND_URL = "https://seu-backend-url.onrender.com"');
  console.log('\nPor:');
  console.log('   BACKEND_URL = "https://seu-backend-render.onrender.com"');
  console.log('   (com a URL real que o Render te deu)\n');
  process.exit(1);
}

console.log('\n✅ CONFIGURAÇÃO PARA NETLIFY\n');
console.log('=' .repeat(60));
console.log('Sua URL do Backend:', BACKEND_URL);
console.log('=' .repeat(60));

console.log('\n📋 INSTRUÇÕES:\n');
console.log('1. Vá para seu site no Netlify');
console.log('   👉 https://app.netlify.com');
console.log('\n2. Selecione seu site "nexus-app" ou similar\n');
console.log('3. Vá para: Site Settings → Build & Deploy → Environment\n');
console.log('4. Clique em "Edit variables"\n');
console.log('5. Adicione uma nova variável:\n');
console.log('   Key:   VITE_API_BASE_URL');
console.log(`   Value: ${BACKEND_URL}\n`);
console.log('6. Clique em "Save"\n');
console.log('7. Volte para "Deployments" e clique "Trigger deploy"\n');
console.log('=' .repeat(60));
console.log('\n✅ Pronto! Seu app vai funcionar em qualquer dispositivo!\n');

// Criar arquivo .env.production.local com a URL
const envContent = `VITE_API_BASE_URL=${BACKEND_URL}\n`;
const envPath = path.join(__dirname, '.env.production.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Arquivo criado: .env.production.local`);
  console.log(`   (Este arquivo é ignorado pelo git e não será enviado)\n`);
} catch (error) {
  console.log(`⚠️  Não foi possível criar .env.production.local\n`);
}

console.log('🎉 Agora é só configurar no Netlify e pronto!\n');
