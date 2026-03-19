#!/bin/bash

# Setup automaticamente no Replit
# Este script roda automaticamente quando você clica "Run"

set -e

echo "📦 Instalando dependências..."
npm ci

echo "🔧 Gerando cliente Prisma..."
npx prisma generate

echo "🗄️  Aplicando migrations..."
npx prisma migrate deploy

echo "🏗️  Buildando frontend..."
npm run build

echo "✅ Setup concluído! Iniciando servidor..."
npm start
