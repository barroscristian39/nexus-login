# 🚀 REPLIT: Setup Automático (Pronto para Colar)

## ✅ O que foi criado para você:

Três arquivos de configuração que o Replit detecta automaticamente:

1. **`.replit`** - Configuração do Replit
2. **`replit.nix`** - Dependências do sistema
3. **`setup-replit.sh`** - Script de setup

Quando você subir a pasta no Replit, ele automaticamente:
- ✅ Instala Node.js
- ✅ Instala dependências (`npm ci`)
- ✅ Gera cliente Prisma
- ✅ Aplica migrations
- ✅ Faz build do React
- ✅ Inicia o servidor

---

## 📋 Passo 1: Vá no Replit

Abra: https://replit.com

---

## 📋 Passo 2: Create Repl

1. Clique em **"Create Repl"**
2. Escolha **"Node.js"**
3. Dê um nome: `nexus-app`
4. Clique **"Create"**

---

## 📋 Passo 3: Upload sua Pasta

### Opção A: Drag and Drop (Melhor)
- Abra seu `nexus-login` no Windows Explorer
- Arraste a pasta inteira para a aba "Files" do Replit
- Aguarde upload

### Opção B: Arquivo por Arquivo
- Clique em **"Upload files"** (ícone +)
- Selecione todos os arquivos da sua pasta
- Upload

**Certifique-se que a estrutura fica assim:**
```
nexus-app/ (raiz do Replit)
├─ backend/
├─ prisma/
├─ src/
├─ public/
├─ package.json        ← IMPORTANTE!
├─ .replit             ← IMPORTANTE!
├─ replit.nix          ← IMPORTANTE!
└─ setup-replit.sh     ← IMPORTANTE!
```

---

## 📋 Passo 4: Adicione Secrets (Variáveis)

1. Clique em **"Secrets"** (🔑 na barra lateral)
2. Clique em **"Add new secret"**

### Secret 1:
```
KEY: DATABASE_URL
VALUE: postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Secret 2:
```
KEY: DIRECT_URL
VALUE: postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### Secret 3:
```
KEY: JWT_SECRET
VALUE: nexus_secret_key_production_2026_change_me
```

### Secret 4:
```
KEY: NODE_ENV
VALUE: production
```

### Secret 5:
```
KEY: VITE_API_BASE_URL
VALUE: https://seu-replit.replit.dev
```
(Você atualizará isso depois com a URL gerada)

---

## 📋 Passo 5: Click "Run"

1. Clique no botão verde **"Run"** no topo
2. Replit vai:
   - Instalar tudo
   - Fazer build
   - Aplicações migrations
   - Iniciar servidor

**Aguarde 3-5 minutos** na primeira vez

---

## ✅ Quando Terminar

Você verá no console:
```
[NEXUS API] Rodando em http://localhost:4000
✅ Setup concluído! Iniciando servidor...
```

E uma URL será gerada tipo:
```
https://nexus-app.replit.dev
```

---

## 🧪 Teste

1. Clique na URL gerada
2. Seu app abre
3. Tente fazer login
4. ✅ **Deve funcionar!**

---

## 🎯 Resumo dos Arquivos Criados

### `.replit`
Define como o Replit deve rodar sua aplicação.
```
run = "npm run build && npm start"
```

### `replit.nix`
Instala dependências de sistema (Node.js, etc).
```
pkgs.nodejs_20
```

### `setup-replit.sh`
Script que roda na primeira vez para configurar tudo.

---

## 🎁 Bonus: Redeploy Automático

Toda vez que você quiser redeploy:
1. Clique no botão **"Stop"** (para parar o servidor)
2. Clique em **"Run"** (para iniciar novamente)

Pronto! Servidor atualizado.

---

## 🆘 Se der Erro

### "Module not found"
```bash
# No console do Replit, rode:
npm install
```

### "Port already in use"
- Clique "Stop"
- Clique "Run" novamente

### "Cannot find prisma"
- Aguarde o setup concluir (espere os logs)
- Ou rode no console: `npx prisma generate`

---

## 🎉 Pronto!

Seu app está ONLINE! 

**Proximas opções:**
- Usar domínio gerado (grátis)
- Ou comprar domínio customizado
- Ou fazer deploy em outro lugar

---

**Tudo configurado! Boa sorte! 🚀**
