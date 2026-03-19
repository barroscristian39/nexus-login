import http from 'http';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testAuth() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          TESTE COMPLETO DE AUTENTICAÇÃO - DEBUG            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Verificar dados no banco
    console.log('═══ PASSO 1: Verificar dados no banco de dados ═══');
    const master = await prisma.usuario.findUnique({
      where: { email: 'barroscristian39@gmail.com' }
    });

    if (!master) {
      console.log('❌ ERRO: Usuário não encontrado no banco!');
      return;
    }

    console.log('✅ Usuário encontrado:');
    console.log(`   Nome: ${master.nome}`);
    console.log(`   Email: ${master.email}`);
    console.log(`   Perfil: ${master.perfil}`);
    console.log(`   TipoUsuario: ${master.tipoUsuario}`);
    console.log(`   Status: ${master.status}`);
    console.log(`   Senha Hash: ${master.senhaHash.substring(0, 20)}...`);

    // 2. Testar hash da senha
    console.log('\n═══ PASSO 2: Testar hashing da senha ═══');
    const senhaTestada = '12345678';
    console.log(`Senha testada: ${senhaTestada}`);
    
    const senhaValida = await bcrypt.compare(senhaTestada, master.senhaHash);
    console.log(`bcrypt.compare resultado: ${senhaValida}`);
    
    if (!senhaValida) {
      console.log('❌ ERRO: Senha não corresponde!');
      
      // Testar criar nova hash
      console.log('\n   Criando nova hash para comparação...');
      const novaSenha = await bcrypt.hash(senhaTestada, 10);
      console.log(`   Nova hash: ${novaSenha}`);
      
      const testeNovoHash = await bcrypt.compare(senhaTestada, novaSenha);
      console.log(`   Comparação com novo hash: ${testeNovoHash}`);
    } else {
      console.log('✅ Senha válida!');
    }

    // 3. Testar rota de login
    console.log('\n═══ PASSO 3: Testar rota de login ═══');
    const loginPayload = {
      email: 'barroscristian39@gmail.com',
      senha: '12345678'
    };
    
    console.log(`Enviando para /api/auth/login:`);
    console.log(`  Email: ${loginPayload.email}`);
    console.log(`  Senha: ${loginPayload.senha}`);

    const loginResponse = await makeRequest('POST', '/api/auth/login', loginPayload);
    console.log(`\nResposta: Status ${loginResponse.status}`);
    console.log(JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.status !== 200) {
      console.log('\n❌ LOGIN FALHOU!');
      console.log(`Mensagem: ${loginResponse.data.message}`);
      return;
    }

    console.log('\n✅ LOGIN BEM-SUCEDIDO!');

    // 4. Testar token
    const token = loginResponse.data.data?.token;
    if (!token) {
      console.log('❌ ERRO: Token não retornado!');
      return;
    }

    console.log('\n═══ PASSO 4: Testar token JWT ═══');
    console.log(`Token gerado: ${token.substring(0, 50)}...`);

    // 5. Testar GET /me
    console.log('\n═══ PASSO 5: Testar GET /me com token ═══');
    const meResponse = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${token}`
    });

    console.log(`Resposta: Status ${meResponse.status}`);
    if (meResponse.status === 200) {
      console.log('✅ Token válido!');
      console.log(`   Usuário: ${meResponse.data.data?.nome}`);
    } else {
      console.log('❌ Token inválido!');
      console.log(JSON.stringify(meResponse.data, null, 2));
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║               TESTE CONCLUÍDO COM SUCESSO                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
