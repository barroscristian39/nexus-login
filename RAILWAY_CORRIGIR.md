# 🚀 RAILWAY: Corrigir Erro de Build

## ❌ Erro que teve:
```
Error creating build plan with Railpack
Build image failed
```

## ✅ Solução:

### Passo 1: Delete Build Anterior com Falha
1. No Railway Dashboard, seu projeto `nexus`
2. Clique na aba **"Deployments"**
3. Clique no deployment que falhou
4. Clique **"Delete"** ou **"Redeploy"**

### Passo 2: Configure Build Manualmente

1. Em seu projeto, vá para **"Settings"**
2. Procure por **"Build Command"** ou **"Builder"**
3. Tente uma dessas opções:

#### Opção A: Bash Script
```
Build Command: bash build.sh
```

#### Opção B: Comando Direto
```
Build Command: npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
```

#### Opção C: Node Script
```
Build Command: node -e "require('child_process').execSync('npm ci && npx prisma generate && npx prisma migrate deploy && npm run build', {stdio: 'inherit'})"
```

### Passo 3: Configurar Start Command

```
Start Command: npm start
```

Ou:
```
Start Command: NODE_ENV=production node backend/server.js
```

### Passo 4: Variáveis de Ambiente

Vá para **"Variables"** e adicione:

```
DATABASE_URL = postgresql://...
DIRECT_URL = postgresql://...
JWT_SECRET = sua_chave
NODE_ENV = production
```

### Passo 5: Clicar "Deploy" Novamente

Railway vai tentar fazer build novo com a configuração correta.

---

## 🆘 Se Ainda Der Erro:

### Erro: "prisma not found"
Rode no Railway CLI:
```bash
npm install -g @prisma/cli
```

### Erro: "Cannot find module"
Rode:
```bash
npm ci --only=prod
```

### Erro: "Port already in use"
Configure porta dinâmica:
No arquivo backend/server.js, próximo ao final:
```javascript
const port = Number(process.env.PORT || process.env.API_PORT || 4000);
```

---

## 📋 Arquivos Adicionados:

- `railway.json` - Configuração do Railway
- `build.sh` - Script atualizado

Esses já foram adicionados ao seu projeto.

---

## 🎯 Próximo Passo:

1. Va em seu projeto Railways
2. Em **"Deployments"**, clique **"Redeploy"** (ou delete + novo)
3. Configura Build e Start Commands conforme indicado acima  
4. Clique "Deploy"
5. Aguarde 2-3 min

---

Se ainda não funcionar, me manda print do novo erro exato!
