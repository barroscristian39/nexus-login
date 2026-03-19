import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificar() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        VERIFICAÇÃO DE TABELAS ESPECÍFICAS POR TIPO         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Todos os usuários
    console.log('1️⃣  TABELA USUARIO - Todos os usuários:');
    const todos = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, tipoUsuario: true }
    });
    todos.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.nome} (${u.tipoUsuario}) - ${u.email}`);
    });

    // 2. MasterUsuario
    console.log('\n2️⃣  TABELA MASTERUSUARIO:');
    const masters = await prisma.masterUsuario.findMany({
      include: { usuario: { select: { nome: true, email: true } } }
    });
    if (masters.length === 0) {
      console.log('   ❌ Nenhum registro');
    } else {
      masters.forEach((m) => {
        console.log(`   ✅ ${m.usuario.nome} (${m.usuario.email})`);
      });
    }

    // 3. UsuarioPrincipal
    console.log('\n3️⃣  TABELA USUARIOPRINCIPAL:');
    const principais = await prisma.usuarioPrincipal.findMany({
      include: { usuario: { select: { nome: true, email: true } } }
    });
    if (principais.length === 0) {
      console.log('   ❌ Nenhum registro');
    } else {
      principais.forEach((p) => {
        console.log(`   ✅ ${p.usuario.nome} (${p.usuario.email})`);
      });
    }

    // 4. Subusuario
    console.log('\n4️⃣  TABELA SUBUSUARIO:');
    const subs = await prisma.subusuario.findMany({
      include: { usuario: { select: { nome: true, email: true } } }
    });
    if (subs.length === 0) {
      console.log('   ❌ Nenhum registro');
    } else {
      subs.forEach((s) => {
        console.log(`   ✅ ${s.usuario.nome} (${s.usuario.email})`);
      });
    }

    // 5. Resumo
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                       RESUMO FINAL                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`Total de usuários: ${todos.length}`);
    console.log(`Usuários MASTER: ${masters.length} ✅`);
    console.log(`Usuários PRINCIPAL: ${principais.length} ✅`);
    console.log(`Usuários SUBUSUARIO: ${subs.length} ✅`);

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificar();
