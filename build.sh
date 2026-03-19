#!/bin/bash

set -e

echo "📦 [1/4] Instalando dependências..."
npm ci

echo "🔧 [2/4] Gerando cliente Prisma..."
npx prisma generate

echo "🗄️  [3/4] Aplicando migrations..."
npx prisma migrate deploy

echo "🏗️  [4/4] Buildando frontend..."
npm run build

echo "✅ Build completado com sucesso!"
