import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function investigar() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║              INVESTIGAÇÃO MASTER USER - NÍVEL SENIOR       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Raw query - Todos os usuários
    console.log('1️⃣  QUERY DIRETA NO BANCO - Todos os usuários:');
    const usuarios = await prisma.$queryRaw`
      SELECT id, nome, email, perfil, "tipoUsuario", status FROM "Usuario"
    `;
    console.log(JSON.stringify(usuarios, null, 2));

    // 2. Prisma findMany
    console.log('\n2️⃣  PRISMA findMany - Todos os usuários:');
    const usuariosORM = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        tipoUsuario: true,
        status: true
      }
    });
    console.log(JSON.stringify(usuariosORM, null, 2));

    // 3. Procurar especificamente
    console.log('\n3️⃣  PROCURAR ESPECÍFICO - barroscristian39@gmail.com:');
    const master = await prisma.usuario.findUnique({
      where: { email: 'barroscristian39@gmail.com' }
    });
    console.log(master ? '✅ ENCONTRADO!' : '❌ NÃO ENCONTRADO!');
    if (master) {
      console.log(JSON.stringify(master, null, 2));
    }

    // 4. Contar usuários
    console.log('\n4️⃣  CONTAGEM - Total de usuários:');
    const totalCount = await prisma.usuario.count();
    console.log(`Total: ${totalCount}`);

    // 5. Verificar MASTER
    console.log('\n5️⃣  VERIFICAR USUÁRIOS COM PERFIL MASTER:');
    const masterUsers = await prisma.usuario.findMany({
      where: { perfil: 'MASTER' }
    });
    console.log(`Total MASTER: ${masterUsers.length}`);
    masterUsers.forEach(u => {
      console.log(`  - ${u.nome} (${u.email})`);
    });

  } catch (error) {
    console.error('❌ ERRO NA QUERY:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

investigar();
