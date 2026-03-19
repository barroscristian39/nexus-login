import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('=== Verificando Banco de Dados ===\n');

    // Contar usuários
    const usuariosCount = await prisma.usuario.count();
    console.log(`Total de usuários: ${usuariosCount}`);

    // Listar todos os usuários
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        tipoUsuario: true,
        status: true
      }
    });

    console.log('\nUsuários no banco:');
    usuarios.forEach((u, idx) => {
      console.log(`${idx + 1}. ${u.nome} (${u.email})`);
      console.log(`   Perfil: ${u.perfil} | Tipo: ${u.tipoUsuario} | Status: ${u.status}`);
    });

    // Procurar master específico
    const master = await prisma.usuario.findUnique({
      where: { email: 'barroscristian39@gmail.com' }
    });

    console.log('\n=== Procurando Master ===');
    if (master) {
      console.log('✅ Master encontrado!');
      console.log(JSON.stringify(master, null, 2));
    } else {
      console.log('❌ Master NÃO encontrado no banco!');
    }

    // Contar empresas
    const empresasCount = await prisma.empresa.count();
    console.log(`\nTotal de empresas: ${empresasCount}`);

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
