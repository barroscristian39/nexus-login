#!/usr/bin/env node

/**
 * Script para verificar configuração antes de fazer deploy
 * Uso: node verify-deployment.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
};

function log(type, message) {
  const icons = {
    pass: '✅',
    fail: '❌',
    warn: '⚠️ ',
    info: 'ℹ️ ',
  };

  console.log(`${icons[type]} ${message}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log('pass', `${description} encontrado`);
    checks.passed++;
    return true;
  } else {
    log('fail', `${description} NÃO encontrado: ${filePath}`);
    checks.failed++;
    checks.errors.push(`Faltando: ${filePath}`);
    return false;
  }
}

function checkContent(filePath, pattern, description) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (pattern.test ? pattern.test(content) : content.includes(pattern)) {
    log('pass', `${description}`);
    checks.passed++;
  } else {
    log('warn', `${description} não encontrado em ${filePath}`);
    checks.warnings++;
  }
}

console.log('\n🔍 Verificando configuração para deploy...\n');

// Verificar arquivos essenciais
console.log('📦 Arquivos de Configuração:');
checkFile(path.join(__dirname, 'package.json'), 'package.json');
checkFile(path.join(__dirname, 'vite.config.ts'), 'vite.config.ts');
checkFile(path.join(__dirname, 'netlify.toml'), 'netlify.toml');
checkFile(path.join(__dirname, '.env.production'), '.env.production');

// Verificar configuração do backend
console.log('\n🔗 Configuração do Backend:');
const envProd = path.join(__dirname, '.env.production');
if (fs.existsSync(envProd)) {
  const content = fs.readFileSync(envProd, 'utf-8');
  const hasApiUrl = /VITE_API_BASE_URL\s*=\s*"?https?:\/\//.test(content);
  
  if (hasApiUrl) {
    log('pass', 'VITE_API_BASE_URL está configurado em .env.production');
    checks.passed++;
  } else if (content.includes('VITE_API_BASE_URL')) {
    log('warn', 'VITE_API_BASE_URL existe mas não está configurado com URL válida');
    checks.warnings++;
    checks.errors.push('VITE_API_BASE_URL precisa de URL do backend em .env.production');
  } else {
    log('fail', 'VITE_API_BASE_URL não encontrado em .env.production');
    checks.failed++;
    checks.errors.push('Adicione VITE_API_BASE_URL=https://seu-backend-url.com em .env.production');
  }
}

// Verificar App.tsx
console.log('\n⚛️  Configuração do Frontend:');
checkContent(
  path.join(__dirname, 'src', 'App.tsx'),
  /import\.meta\.env\.VITE_API_BASE_URL/,
  'App.tsx usa import.meta.env.VITE_API_BASE_URL'
);

// Verificar scripts de build
console.log('\n🏗️  Scripts de Build:');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
if (packageJson.scripts?.build) {
  log('pass', `Script "build" encontrado: ${packageJson.scripts.build}`);
  checks.passed++;
} else {
  log('fail', 'Script "build" não encontrado em package.json');
  checks.failed++;
}

// Resumo
console.log('\n' + '='.repeat(50));
console.log(`✅ Passou: ${checks.passed}`);
console.log(`❌ Falhou: ${checks.failed}`);
console.log(`⚠️  Avisos: ${checks.warnings}`);

if (checks.errors.length > 0) {
  console.log('\n❗ Ações necessárias:');
  checks.errors.forEach((error, i) => {
    console.log(`${i + 1}. ${error}`);
  });
  process.exit(1);
} else if (checks.warnings > 0) {
  console.log('\n👉 Recomendações:');
  console.log('1. Verifique se VITE_API_BASE_URL está configurado corretamente');
  console.log('2. Configure as mesmas variáveis no Netlify Dashboard');
  process.exit(0);
} else {
  console.log('\n🚀 Tudo pronto para deploy!');
  process.exit(0);
}
