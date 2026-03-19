# 🚀 VERCEL: Deploy em 3 Cliques (2 Minutos)

## ✅ Passo 1: Crie Conta no Vercel

Abra: https://vercel.com

Clique em **"Sign up"** → **"Continue with GitHub"**

Autorize o Vercel a acessar seu GitHub.

---

## ✅ Passo 2: Importe seu Projeto

1. Clique em **"Add New"** (canto superior direito)
2. Selecione **"Project"**
3. Procure por `nexus-login` na lista
4. Clique em **"Import"**

---

## ✅ Passo 3: Configuração Automática

Vercel vai mostrar uma tela de configuração:

### Detectou automaticamente:
- ✅ Framework: React/Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

**DEIXE TUDO COMO ESTÁ!**

---

## ✅ Passo 4: Variáveis de Ambiente

Procure pela seção **"Environment Variables"**

Clique em **"Add"** e preencha cada uma:

### Variável 1:
```
Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Clique **"Add"**

### Variável 2:
```
Key: DIRECT_URL
Value: postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

Clique **"Add"**

### Variável 3:
```
Key: JWT_SECRET
Value: nexus_super_secret_key_2026_change_this_in_production
```

Clique **"Add"**

### Variável 4:
```
Key: NODE_ENV
Value: production
```

Clique **"Add"**

---

## ✅ Passo 5: Deploy!

Clique no botão grande azul **"Deploy"**

**Aguarde 2-3 minutos...**

Você verá um progresso tipo:
```
Cloned successfully
Installing dependencies
Running build script
Deployed successfully!
```

---

## ✅ Quando Terminar

Você receberá uma URL como:
```
https://nexus-login-abc123.vercel.app
```

**PRONTO! Seu app está ONLINE!** 🎉

---

## 🧪 Teste Agora

1. Copie a URL gerada
2. Abra em **outro dispositivo** (celular, outro PC)
3. Tente fazer login
4. ✅ **Deve funcionar perfeitamente!**

---

## 🎯 Resumo do que Vercel faz:

```
✅ Instala todas as dependências
✅ Compila o React (Vite)
✅ Executa migrations do Prisma
✅ Roda o backend Node.js
✅ Compila tudo junto
✅ Hospeda em servidor global
✅ Gera HTTPS automático
✅ Domínio gratuito
✅ Auto-redeploy quando fizer push
```

---

## 🎁 Bonus: Auto-Deploy

Depois que estiver online:

Toda vez que você fizer:
```bash
git push origin main
```

Vercel **automaticamente**:
1. Deteta a mudança
2. Faz build novo
3. Deploy novo
4. App atualizado em minutos

---

## ✅ Pronto!

Seu aplicativo está LIVE em: `https://seu-app.vercel.app`

**Usuarios de qualquer lugar conseguem acessar agora!** 🌍

---

**Qual é o próximo passo?**
