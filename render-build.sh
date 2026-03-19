#!/bin/bash

set -e  # Parar em qualquer erro

echo "🔧 [1/4] Limpando build anterior..."
rm -rf node_modules/.bin/prisma

echo "📦 [2/4] Instalando dependências..."
npm ci

echo "🗄️  [3/4] Gerando cliente Prisma..."
npx prisma generate

echo "🔄 [4/4] Aplicando migrations..."
npx prisma migrate deploy

echo "✅ Build completado com sucesso!"
