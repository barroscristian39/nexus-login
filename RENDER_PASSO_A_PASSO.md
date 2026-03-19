# 🚀 GUIA VISUAL: DEPLOY NO RENDER EM 5 MINUTOS

## ✅ Pré-requisitos
- ✅ Tudo está pronto no seu código (já fizemos!)
- ✅ Você tem repositório GitHub
- ✅ Código está commitado

---

## 📋 PASSO 1: Acessar Render

**👉 Abra no navegador**: https://dashboard.render.com

Se não tem conta:
1. Clique em **"Sign up"**
2. Conecte com GitHub (recomendado)
3. Autorize o acesso

---

## 🔧 PASSO 2: Criar Web Service

1. Clique em **"New +"** (canto superior direito)
2. Selecione **"Web Service"**

![Passo 2](https://imgur.com/example.png)

---

## ⚙️ PASSO 3: Conectar Repositório GitHub

1. Será pedido para selecionar repositório
2. Encontre seu repositório `nexus-login`
3. Clique em **"Connect"**

---

## 🛠️ PASSO 4: Configurar Web Service

Preencha os campos conforme a tabela abaixo:

| Campo | Valor |
|-------|-------|
| **Name** | `nexus-api` |
| **Branch** | `main` (ou `master`) |
| **Root Directory** | (deixar vazio) |
| **Build Command** | `bash render-build.sh` |
| **Start Command** | `node backend/server.js` |
| **Instance Type** | `Free` |
| **Region** | (escolha mais próximo) |

---

## 🔐 PASSO 5: Adicionar Variáveis de Ambiente

Na mesma página, procure por **"Environment"** ou **"Env Vars"**

Clique em **"Add Environment Variable"** para cada uma:

### 1️⃣ DATABASE_URL
```
DATABASE_URL=postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2️⃣ DIRECT_URL
```
DIRECT_URL=postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### 3️⃣ JWT_SECRET
```
JWT_SECRET=nexus_secret_key_change_this_in_production_use_long_random_value
```

### 4️⃣ NODE_ENV
```
NODE_ENV=production
```

### 5️⃣ GEMINI_API_KEY
```
(deixe em branco ou adicione sua chave se tiver)
```

---

## 🚀 PASSO 6: Deploy

1. Role para baixo
2. Clique em **"Create Web Service"** (botão azul grande)

Render começará o deploy automaticamente. Você verá as logs aparecendo.

---

## ⏳ AGUARDE

O deployment pode levar **2-3 minutos**. Você verá:

```
[Build] npm install
[Build] Building...
[Build] npm run build (se tiver)
[Build] npx prisma migrate deploy
[Deploy] npm start
[Deploy] Server running on port 4000
```

Quando estiver pronto, você verá:
- ✅ **Status: "Live"** (verde)
- 🌐 **URL**: Algo como `https://nexus-api-abcd1234.onrender.com`

---

## 📝 PRÓXIMO PASSO

⚠️ **IMPORTANTE**: Copie essa URL! Você vai precisar dela.

Quando tiver a URL do seu backend:
- Volte aqui e fale comigo
- Vou configurar no Netlify
- Pronto! Vai funcionar 🎉

---

## 🆘 SE ALGO DER ERRADO

### Erro: "Build failed"
- Verifique o console de logs
- Geralmente é problema com variáveis de ambiente

### Erro: "Migration failed"
- Verifique se DATABASE_URL está correta
- Ou se as migrations estão no arquivo

### Erro: "Port already in use"
- Render usa porta 4000 por padrão
- Não precisa mudar nada

---

## ✅ CHECKLIST

- [ ] Acessei https://dashboard.render.com
- [ ] Criei novo Web Service
- [ ] Conectei repositório GitHub
- [ ] Preenchei Name, Branch, Build/Start Commands
- [ ] Adicionei 5 variáveis de ambiente
- [ ] Cliquei "Create Web Service"
- [ ] Aguardei deployment (status = Live)
- [ ] Copiei a URL gerada
- [ ] Voltei aqui com a URL

---

## 🎯 RESUMO

Você está configurando um servidor Node.js que vai rodar seu backend.

**Resultado final:**
```
https://seu-backend-url.onrender.com/api/health
```

Este servidor vai responder às requisições do seu frontend no Netlify.

---

**Quando tiver a URL, volte para o próximo passo! 🚀**
