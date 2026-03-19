# 📋 CHECKLIST: DEPLOY EM 3 ETAPAS

## 🔴 ETAPA 1: RENDER (Backend) - 5 minutos

Abra: [RENDER_PASSO_A_PASSO.md](RENDER_PASSO_A_PASSO.md)

- [ ] Acessei https://dashboard.render.com
- [ ] Criei conta (se não tiver)
- [ ] Cliquei "New +" → "Web Service"
- [ ] Conectei meu repositório GitHub
- [ ] Preenchei "Name" = `nexus-api`
- [ ] Preenchei "Build Command" = `npm install && npx prisma migrate deploy`
- [ ] Preenchei "Start Command" = `node backend/server.js`
- [ ] Adicionei variáveis:
  - [ ] DATABASE_URL
  - [ ] DIRECT_URL
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
  - [ ] GEMINI_API_KEY (opcional)
- [ ] Cliquei "Create Web Service"
- [ ] **Aguardei deploy completar (status = Live)**
- [ ] **Copiei a URL gerada** (exemplo: `https://nexus-api-abcd1234.onrender.com`)
- [ ] ✅ **Testei**: Acessei `https://sua-url/api/health` e vi JSON

**Sua URL do Backend**: `https://________________`  ← Escreva aqui

---

## 🟠 ETAPA 2: SETUP LOCAL (Preparar Frontend) - 1 minuto

Edite o arquivo `setup-netlify.mjs`:

```javascript
// Linha 15, ANTES:
const BACKEND_URL = 'https://seu-backend-url.onrender.com';

// Linha 15, DEPOIS (substitua com sua URL real):
const BACKEND_URL = 'https://nexus-api-abcd1234.onrender.com';
```

Execute no terminal:
```bash
node setup-netlify.mjs
```

- [ ] Editei `setup-netlify.mjs` com URL real
- [ ] Executei `node setup-netlify.mjs`
- [ ] Seguir instruções que aparecerem

---

## 🟢 ETAPA 3: NETLIFY (Frontend) - 2 minutos

Abra: https://app.netlify.com

- [ ] Selecionei meu site "nexus-app"
- [ ] Fui em "Site Settings"
- [ ] Cliquei em "Build & Deploy"
- [ ] Cliquei em "Environment"
- [ ] Cliquei em "Edit variables"
- [ ] Adicionei nova variável:
  - [ ] Key = `VITE_API_BASE_URL`
  - [ ] Value = `https://sua-url.onrender.com` (do Passo 1)
- [ ] Cliquei "Save"
- [ ] Voltei para "Deployments"
- [ ] Cliquei "Trigger deploy"
- [ ] **Aguardei deploy completar**
- [ ] ✅ **Testei**: Acessei `https://seu-app.netlify.app` e tentei fazer login

---

## 🧪 TESTE FINAL

### De outro dispositivo (celular, outro PC, etc):

```
1. Acessar: https://seu-app.netlify.app
   [ ] Página carregou sem erro "text/html"?

2. Não abrir console de erro?
   [ ] Sem erros de CORS?
   [ ] Sem erros de JSON?

3. Fazer login?
   [ ] Conseguir digitar email/senha?
   [ ] Conseguir clicar "Entrar"?
   [ ] Recebeu resposta da API?
   [ ] ✅ Entrou na aplicação?

4. Navegar pela app?
   [ ] Dashboard funciona?
   [ ] Listar demandas funciona?
   [ ] Criar demanda funciona?
   [ ] Tudo carrega normal?
```

---

## ✅ RESULTADO

Se everything acima marcado com ✅:

```
🎉 PARABÉNS! 🎉

Sua aplicação está funcionando em qualquer dispositivo!

Frontend:  https://seu-app.netlify.app
Backend:   https://seu-backend.onrender.com
Banco:     PostgreSQL no Neon (configurado)

✅ Usuários podem acessar de qualquer lugar
✅ Sem erros "text/html"
✅ Tudo funcionando
```

---

## 🆘 PROBLEMAS?

### Erro: "Invalid JSON" ou "text/html"
- [ ] Verifique se `VITE_API_BASE_URL` foi adicionado no Netlify
- [ ] Verifique se fez "Trigger deploy" após adicionar a variável
- [ ] Verifique se a URL do Render está correta (sem trailing slash)

### Erro: "CORS error"
- [ ] Seu backend está respondendo?
- [ ] Teste: https://sua-url-render/api/health
- [ ] Deve retornar JSON, não HTML

### Render com status "Failed"
- [ ] Verifique o console de logs do Render
- [ ] Verifique se DATABASE_URL está correto
- [ ] Verifique se todas as 5 variáveis foram adicionadas

### Still broken?
- [ ] Volte aqui e descreva o erro exato
- [ ] Vou te ajudar 👊

---

## 📞 Pronto?

Quando tudo estiver funcionando, avisa! 🚀

Próximo passo será melhorias e features no código.
