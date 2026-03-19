#!/bin/bash

# 🚀 CÓDIGO PRONTO PARA REPLIT
# Cole este código no console do Replit se precisar fazer setup manual

# Passo 1: Instalar dependências
npm ci

# Passo 2: Gerar cliente Prisma
npx prisma generate

# Passo 3: Aplicar migrations
npx prisma migrate deploy

# Passo 4: Build do React
npm run build

# Passo 5: Iniciar servidor
npm start

# ✅ Pronto! Seu app está rodando em PORT 3000
# Acesse: https://seu-replit.replit.dev

# Se tiver erro, isso te ajuda debugar:
echo "✅ Servidor iniciado com sucesso"
ps aux | grep node
