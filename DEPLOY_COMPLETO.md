# 🚀 GUIA COMPLETO: DEPLOY NEXUS NO RENDER + NETLIFY

## ✅ O que foi preparado

- ✅ Backend pronto para produção (`server-prod.js`)
- ✅ Frontend buildado (`dist/`)
- ✅ Arquivo de configuração Render (`render.yaml`)
- ✅ Arquivo Procfile para plataformas como Render
- ✅ Variáveis de ambiente configuradas
- ✅ Scripts de teste e verificação

---

## 📋 PASSO-A-PASSO DE DEPLOY

### PASSO 1: Testar Localmente (Opcional mas Recomendado)

Antes de fazer deploy, teste se tudo funciona localmente:

```bash
# Terminal 1: Iniciar Backend
npm run api:dev

# Terminal 2: Testar endpoints
npm run test:prod
```

---

### PASSO 2: Deploy do Backend no Render.com

#### 2.1. Preparar Repositório
```bash
git add .
git commit -m "Preparar para deploy: adicionar render.yaml e server-prod.js"
git push origin main
```

#### 2.2. Criar Serviço no Render
1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `nexus-api`
   - **Branch**: `main`
   - **Root Directory**: deixar vazio
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `node backend/server-prod.js`
   - **Instance Type**: Free (ou Starter)

#### 2.3. Adicionar Banco de Dados
1. No Dashboard do Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `nexus-db`
   - **Database**: `nexus`
   - **User**: `nexus_user`
   - **Region**: Same as service
   - **Plan**: Free

3. Após criar, copie o **Internal Database URL**

#### 2.4. Configurar Variáveis de Ambiente
1. Em seu serviço Web (nexus-api), vá para **"Environment"**
2. Adicione as variáveis:

```
DATABASE_URL=<copie do PostgreSQL Internal URL>
DIRECT_URL=<copie do PostgreSQL Internal URL>
JWT_SECRET=<gere uma string aleatória segura>
GEMINI_API_KEY=<sua chave, ou deixe em branco>
NODE_ENV=production
```

3. Clique em **"Save"**

O Render fará deploy automaticamente. **Copie a URL do seu serviço** (algo como: `https://nexus-api-xyz.onrender.com`)

---

### PASSO 3: Deploy do Frontend no Netlify

#### 3.1. Configurar `.env.production`
Atualize o arquivo com a URL do seu backend:

```env
VITE_API_BASE_URL=https://nexus-api-xyz.onrender.com
APP_URL=seu-app-nexus.netlify.app
```

#### 3.2. Fazer Deploy no Netlify
**Opção A: Via Netlify UI (Mais fácil)**
1. Vá para https://app.netlify.com
2. Clique em **"New site from Git"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Clique em **"Deploy"**

**Opção B: Via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### 3.3. Adicionar Variáveis de Ambiente no Netlify
1. Em seu site → **"Site Settings"** → **"Build & Deploy"** → **"Environment"**
2. Adicione:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://nexus-api-xyz.onrender.com`
3. Clique em **"Save"**

4. Vá para **"Deployments"** → **"Trigger deploy"** para fazer redeploy com as novas variáveis

---

## ✅ VERIFICAÇÃO FINAL

### Testar Frontend em Produção
1. Acesse seu site do Netlify: `https://seu-app-nexus.netlify.app`
2. Abra o DevTools (F12) → **Network**
3. Tente fazer login
4. Verifique se as requisições estão indo para a URL do Render

### Testar de Outro Dispositivo
1. Use seu telefone ou outro computador
2. Tente acessar o site
3. Tente fazer login ou outra ação que chame a API

---

## 🐛 TROUBLESHOOTING

### Erro: "Invalid JSON" ou "text/html"
**Causa**: Frontend está acessando `/api` em vez da URL do backend real

**Solução**:
1. Verifique se `VITE_API_BASE_URL` está configurado no Netlify
2. Redeploy do frontend após alterar a variável

### Erro: "CORS error"
**Causa**: Backend não aceita requisições do domínio do Netlify

**Solução**: Edite `backend/src/app.js`:
```javascript
app.use(cors({ 
  origin: ['https://seu-app.netlify.app', 'http://localhost:3000'],
  credentials: true 
}));
```

### Backend offline ou em sleep
**Causa**: Serviço free do Render coloca em sleep após 15 min de inatividade

**Solução**:
- Upgrade para plano pago ($7/mês)
- Ou use Uptime Monitor para manter acordado

---

## 🔄 DEPLOY FUTURO

Após o setup inicial, cada atualização é simples:

```bash
# Local development
npm run dev         # Frontend (porta 3000)
npm run api:dev     # Backend (porta 4000)

# Para fazer deploy
git add .
git commit -m "mensagem"
git push origin main

# Netlify fará deploy automático do frontend
# Render fará deploy automático do backend
```

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Verifique os logs**:
   - Netlify: Site → "Deploys" → "Deploy log"
   - Render: Service → "Logs"

2. **Teste localmente**:
   ```bash
   npm run test:prod
   ```

3. **Verifique variáveis de ambiente**:
   - `cat .env.production` (não faça commit!)
   - Verifique no painel de cada serviço

---

## 🎉 Pronto!

Seus usuários agora podem acessar a aplicação de qualquer dispositivo! 
```
Frontend:  https://seu-app-nexus.netlify.app
Backend:   https://nexus-api-xyz.onrender.com
API:       https://nexus-api-xyz.onrender.com/api
```
