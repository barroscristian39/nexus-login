# ✅ PRÓXIMOS PASSOS: DEPLOY EM 2 SERVIÇOS

## 🎯 O que você precisa fazer:

### AGORA (5 minutos)
1. Abra [RENDER_PASSO_A_PASSO.md](RENDER_PASSO_A_PASSO.md)
2. Siga os passos para fazer deploy no Render
3. **Copie a URL do seu backend** (vai ser algo como `https://nexus-api-abcd1234.onrender.com`)

### DEPOIS (2 minutos)
1. Edite o arquivo `setup-netlify.mjs` e substitua:
   ```javascript
   const BACKEND_URL = 'https://seu-backend-url.onrender.com'; // AQUI
   ```
   
   Por:
   ```javascript
   const BACKEND_URL = 'https://nexus-api-abc123.onrender.com'; // Sua URL real
   ```

2. Execute:
   ```bash
   node setup-netlify.mjs
   ```

3. Siga as instruções que aparecerem para configurar no Netlify

4. **PRONTO! Seu app funciona em qualquer dispositivo** 🎉

---

## 📊 O que será feito:

| Serviço | O que faz | Onde |
|---------|-----------|------|
| **Render** | Hospeda seu backend (Node.js/API) | https://seu-backend.onrender.com |
| **Netlify** | Hospeda seu frontend (React/HTML/CSS) | https://seu-app.netlify.app |

---

## ⚠️ Importante

- ❌ NÃO tente usar Netlify para backend sozinho
- ✅ Você PRECISA de dois serviços (um para frontend, um para backend)
- ✅ A configuração que fizemos suporta isso

---

## 🆘 Dúvidas?

Quando tiver a URL do Render, volte aqui e me chama! 🚀
