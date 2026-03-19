# 🚀 GUIA REPLIT: Upload sem Git (Passo-a-Passo Visual)

## ✅ Pré-requisito
- Pasta `nexus-login` compactada em `.zip`
- Ou a pasta original sem zip

---

## 📋 PASSO 1: Crie Conta no Replit

**👉 Abra**: https://replit.com

1. Clique em **"Sign Up"** (ou use Google/GitHub)
2. Preencha email e senha
3. Confirme email
4. **Pronto! Você está dentro**

---

## 📋 PASSO 2: Crie um novo Repl

Na página inicial, você verá **"Create"** no canto superior esquerdo.

1. Clique em **"Create Repl"**
2. Procure por **"Node.js"** na lista
3. Clique em **"Node.js"**
4. Dê um nome: `nexus-app`
5. Clique **"Create Repl"**

**Agora você tem um Repl vazio pronto para receber seus arquivos**

---

## 📋 PASSO 3: Upload dos Arquivos

### Opção A: Drag and Drop (Mais Fácil)

1. No painel esquerdo, você verá a aba **"Files"** (já aberta)
2. Veja a pasta vazia com o ícone de pasta
3. **Arraste sua pasta `nexus-login` inteira** do Windows Explorer para lá
4. Replit automaticamente faz o upload

### Opção B: Clicar em "Upload"

1. Clique no ícone **"+"** ao lado de "Files"
2. Selecione **"Upload files"**
3. Selecione todos os arquivos da pasta `nexus-login`
4. Clique **"Open"**

### Opção C: Upload do ZIP (Se compactou)

1. Clique **"+"** → **"Upload files"**
2. Selecione arquivo `.zip`
3. Replit descompacta automaticamente
4. Espere terminar

---

## ⏳ Aguarde Upload Completar

Você verá na barra inferior: `Uploading... 50%`

Quando chegar a 100%, continue.

---

## 📋 PASSO 4: Estrutura de Pastas

Depois do upload, seu Replit deve ficar assim:

```
nexus-login/
  ├─ backend/
  ├─ prisma/
  ├─ public/
  ├─ src/
  ├─ package.json        ← IMPORTANTE!
  ├─ vite.config.ts
  └─ ...
```

Se tudo está errado (arquivos no lugar errado), você pode:
1. Apagar tudo (botão lixo ao lado de cada pasta)
2. Fazer upload de novo

---

## 📋 PASSO 5: Configure Variáveis (Secrets)

1. No painel esquerdo, clique em **"Secrets"** (ícone de chave 🔑)

2. Clique em **"Add new secret"**

3. Adicione uma por uma:

### Secret 1: DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
Clique **"Add secret"**

### Secret 2: DIRECT_URL
```
Key: DIRECT_URL
Value: postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c.sa-east-1.aws.neon.tech/neondb?sslmode=require
```
Clique **"Add secret"**

### Secret 3: JWT_SECRET
```
Key: JWT_SECRET
Value: sua_chave_super_secreta_aqui_pode_ser_qualquer_coisa_longa
```
Clique **"Add secret"**

### Secret 4: NODE_ENV
```
Key: NODE_ENV
Value: production
```
Clique **"Add secret"**

### Secret 5: VITE_API_BASE_URL
```
Key: VITE_API_BASE_URL
Value: https://seu-replit.replit.dev
```
(Você vai atualizar isso depois que tiver a URL)

---

## 📋 PASSO 6: Configure o Start Script

1. Clique em **"Tools"** (chave inglesa 🔧) no painel superior
2. Procure por **".replit"** (arquivo de configuração)
3. Se não existir, crie um novo arquivo com esse nome
4. Adicione esse conteúdo:

```
run = "npm run build && npm start"

[env]
REPLIT_LANGUAGE = "nodejs"
```

5. Salve (Ctrl+S)

---

## 📋 PASSO 7: Execute!

1. Você verá um botão **"Run"** no topo da página (botão verde grande)
2. Clique nele

**Replit vai:**
```
✅ npm ci (instalar dependências)
✅ npx prisma generate (gerar cliente)
✅ npm run build (buildar React)
✅ npm start (iniciar servidor)
```

Aguarde 2-3 minutos enquanto vê o output no console.

---

## ✅ Quando Terminar

Você verá mensagens no console tipo:
```
[NEXUS API] Rodando em http://localhost:4000
```

E um link será gerado tipo:
```
https://nexus-app.replit.dev
```

**Clique no link para testar!**

---

## 🎯 Teste em Outro Dispositivo

1. Copie a URL: `https://seu-replit.replit.dev`
2. Abra em outro PC/Celular
3. Tente fazer login
4. ✅ **Deve funcionar!**

---

## 🆘 Problemas?

### "Upload não está funcionando"
- Teste colocar apenas alguns arquivos primeiro
- Ou compress

a a pasta em ZIP
- Se ZIP não funcionar, arraste a pasta diretamente

### "Comando not found"
- Replit às vezes não instala automaticamente
- No console, rode: `npm install`
- Depois clique **Run** de novo

### "Port already in use"
- Clique no "X" do console (pare a execução)
- Clique "Run" novamente

### "Build failed"
- Verifique os Secrets (DATABASE_URL está correto?)
- Verifique se package.json está na raiz

---

## 📸 Screenshots (Se precisar)

Se tiver dúvida em algum passo, você pode:
1. Fazer print da tela
2. Me enviar
3. Eu corrigia para você

---

## 🎉 Pronto!

Seu app está ONLINE em qualquer dispositivo!

**Próximas escolhas:**
- Domínio customizado (pago)
- Ou manter o Replit URL
- Ou fazer deploy em outro lugar depois

---

**Qual é seu próximo passo agora?**
