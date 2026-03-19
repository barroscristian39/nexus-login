# Guia de Deploy no Netlify com Backend Separado

## Problema Resolvido

O erro **"servidor retornou tipo inválido: text/html; charset=utf-8"** ocorre quando o frontend tenta acessar uma API que retorna HTML em vez de JSON. Isso acontece no Netlify porque:

1. O Netlify hospeda apenas o frontend (arquivos estáticos)
2. O backend não está hospedado no Netlify
3. Quando requisições `/api` são feitas, o Netlify retorna uma página HTML 404

## Solução Implementada

### 1. Configuração de Variáveis de Ambiente

- **Desenvolvimento**: `VITE_API_BASE_URL="http://localhost:4000"`
- **Produção**: `VITE_API_BASE_URL="https://seu-backend-url.com"`

O prefixo `VITE_` é necessário para que o Vite exponha a variável no `import.meta.env`.

### 2. Arquivo netlify.toml

Criado com configurações de build e rewrite de URLs. Se você quer usar proxy, modifique:

```toml
[[rewrites]]
  from = "/api/*"
  to = "https://seu-backend-url/api/:splat"
  status = 200
```

## Passos para Deploy

### Passo 1: Hospedar o Backend

Primeiro, você **PRECISA** hospedar o backend em um serviço. Opções recomendadas:

#### Opção A: Render.com (Mais fácil)
1. Crie conta em https://render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command**: `npm install && npx prisma migrate deploy`
   - **Start Command**: `node backend/server.js`
   - **Environment**: Node
5. Adicione as variáveis de ambiente (DATABASE_URL, JWT_SECRET, etc.)
6. Deploy
7. Copie a URL do serviço (algo como: `https://seu-backend-render.onrender.com`)

#### Opção B: Railway.app
1. Crie conta em https://railway.app
2. Conecte GitHub e selecione seu repositório
3. Configure variáveis de ambiente
4. Railway detecciona automaticamente e faz o deploy

#### Opção C: Vercel
1. Em https://vercel.com, importe o projeto
2. Configure as variáveis de ambiente
3. Deploy

### Passo 2: Configurar `.env.production` no Netlify

1. No seu repositório, edite `.env.production`:
```
VITE_API_BASE_URL="https://seu-backend-url.com"
```

2. Ou configure diretamente no Netlify:
   - Vá para seu site no Netlify
   - **Site Settings** → **Build & Deploy** → **Environment**
   - Adicione a variável:
     - Key: `VITE_API_BASE_URL`
     - Value: `https://seu-backend-url.com`

### Passo 3: Deploy no Netlify

#### Opção 1: Via Netlify UI
1. Conecte seu repositório GitHub ao Netlify
2. Netlify detecta automaticamente:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Configure as variáveis de ambiente
4. Clique em "Deploy"

#### Opção 2: Via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

## Verificação

Após o deploy, acesse seu site no Netlify e:

1. Abra as DevTools (F12)
2. Vá para a aba **Network**
3. Faça uma ação que chame a API (login, criar demanda, etc.)
4. Verifique se as requisições vão para a URL do backend correto
5. Verifique se a resposta é JSON (não HTML)

## Troubleshooting

### Erro: "Failed to fetch" ou "CORS error"

Seu backend precisa ter CORS habilitado. No `backend/src/app.js`, verifique:

```javascript
app.use(cors({ origin: true, credentials: true }));
```

Se necessário, adicione sua URL do Netlify especificamente:

```javascript
app.use(cors({ 
  origin: ['https://seu-dominio.netlify.app', 'http://localhost:3000'],
  credentials: true 
}));
```

### Erro: "Invalid JSON" ou "text/html"

1. Verifique se `VITE_API_BASE_URL` está correto
2. Verifique se o backend está online
3. Verifique se não há slash extra na URL:
   - ✅ Correto: `https://seu-backend.onrender.com`
   - ❌ Errado: `https://seu-backend.onrender.com/`

### Backend offline ou em sleep

Serviços gratuitos (Render, Railway) podem colocar aplicações em sleep quando não estão em uso. Para evitar:

- Render: Pague pelo plano paid ($7/mês)
- Railway: Use plano pago
- Alternativa: Use um uptime monitor (Services como UptimeRobot)

## Resumo das Mudanças

1. ✅ Criado `netlify.toml` com configurações de build e rewrite
2. ✅ Criado `.env.production` com `VITE_API_BASE_URL`
3. ✅ Criado `.env.local` para desenvolvimento
4. ✅ Atualizado `App.tsx` para usar `import.meta.env.VITE_API_BASE_URL`
5. ✅ Atualizado `.env.example` com documentação

## Próximos Passos

1. Escolha um serviço para hospedar o backend
2. Faça o deploy do backend
3. Obtenha a URL do backend
4. Atualize `VITE_API_BASE_URL` no Netlify
5. Faça o deploy do frontend no Netlify
6. Teste acessando de outro dispositivo
