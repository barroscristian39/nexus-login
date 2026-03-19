# 🎯 MAPA DO DEPLOY: ENTENDA O QUE ESTÁ ACONTECENDO

```
┌─────────────────────────────────────────────────────────────┐
│                    SEU APLICATIVO NEXUS                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐       ┌──────────────────────┐    │
│  │   FRONTEND (React)   │       │   BACKEND (Node.js)  │    │
│  │                      │       │                      │    │
│  │  - Tela de login     │◄──────►─ /api/auth/login    │    │
│  │  - Dashboard         │       │  - /api/demandas    │    │
│  │  - Formulários       │       │  - /api/dashboard   │    │
│  │                      │       │  - Database          │    │
│  └──────────────────────┘       └──────────────────────┘    │
│         ↓                               ↓                    │
│    NETLIFY                         RENDER                   │
│  (Servidor estático)          (Servidor Node.js)           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ❌ Antes (Errado - Só Netlify)

```
Usuário acessa: https://seu-app.netlify.app
         ↓
   Netlify serve HTML/CSS/JS
         ↓
   Frontend tenta chamar /api/login
         ↓
   Netlify procura /api/login no servidor estático
         ↓
   ❌ NÃO ENCONTRA (devolvido HTML 404)
         ↓
   "Servidor retornou tipo inválido: text/html"
```

---

## ✅ Agora (Correto - Dois Serviços)

```
┌─ FRONTEND (Netlify) ─────────────────────────┐
│                                               │
│  Usuário: https://seu-app.netlify.app       │
│  Netlify serve: index.html + App.jsx        │
│                                               │
│  Frontend detecta VITE_API_BASE_URL          │
│  e chama: https://seu-backend.onrender.com   │
│           ↓                                  │
│           └──► BACKEND (Render)              │
│                                               │
│  /api/login → Render processa                │
│  Retorna: JSON ✅                            │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 📍 Suas URLs serão:

| Serviço | URL | Quando carrega |
|---------|-----|-----------------|
| Frontend | `https://seu-app.netlify.app` | Quando acessa no navegador |
| Backend | `https://seu-backend.onrender.com` | Quando o frontend chama `/api/*` |

---

## 🔗 Como funcionam juntos:

```javascript
// No seu código (App.tsx):
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// VITE_API_BASE_URL = "https://seu-backend.onrender.com"

// Quando você chama:
fetch(`${API_BASE_URL}/api/login`, { ... })
// Vira:
fetch(`https://seu-backend.onrender.com/api/login`, { ... })
// ✅ Render recebe e processa!
```

---

## ✅ Checklist do Deploy

- [ ] **Render Deploy** (5 min)
  - [ ] Criar Web Service no Render
  - [ ] Conectar GitHub
  - [ ] Adicionar 5 variáveis de ambiente
  - [ ] Clicar "Create" e aguardar
  - [ ] **Copiar URL gerada**

- [ ] **Netlify Configuração** (2 min)
  - [ ] Ir para Site Settings
  - [ ] Build & Deploy → Environment
  - [ ] Adicionar `VITE_API_BASE_URL` com a URL do Render
  - [ ] Trigger deploy
  - [ ] Testar

- [ ] **Teste Final**
  - [ ] Acessar de outro dispositivo
  - [ ] Tentar fazer login
  - [ ] F12 → Network → Verificar se chamar o Render correto
  - [ ] ✅ Funcionando!

---

## 🚀 Pronto!

Quando terminar todos esses passos, seu app funcionará em **qualquer dispositivo, qualquer rede**!

👉 **Comece com**: [RENDER_PASSO_A_PASSO.md](RENDER_PASSO_A_PASSO.md)
