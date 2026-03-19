import bcrypt from 'bcryptjs';
import { PrismaClient, Perfil, TipoUsuario, StatusRegistro } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Deletar todos os dados na ordem correta (respeitando chaves estrangeiras)
  console.log('🧹 Limpando banco de dados...');
  
  await prisma.notificacao.deleteMany();
  await prisma.comentario.deleteMany();
  await prisma.tecnicoResponsavel.deleteMany();
  await prisma.evidencia.deleteMany();
  await prisma.demanda.deleteMany();
  await prisma.projeto.deleteMany();
  await prisma.subusuario.deleteMany();
  await prisma.usuarioPrincipal.deleteMany();
  await prisma.masterUsuario.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.empresa.deleteMany();

  console.log('✅ Banco de dados limpo');

  // Criar APENAS usuário MASTER
  console.log('📝 Criando usuário MASTER...');
  const masterSenha = await bcrypt.hash('12345678', 10);
  const master = await prisma.usuario.create({
    data: {
      nome: 'Cristian Barros',
      email: 'barroscristian39@gmail.com',
      telefone: '(11) 99999-9999',
      senhaHash: masterSenha,
      perfil: Perfil.MASTER,
      tipoUsuario: TipoUsuario.MASTER,
      status: StatusRegistro.ATIVO,
      setor: 'Administração',
      ultimoAcesso: new Date(),
    },
  });

  // Criar registro na tabela MasterUsuario
  await prisma.masterUsuario.create({
    data: {
      usuarioId: master.id,
    },
  });

  console.log('\n✅ ========================================');
  console.log('✅ Seed executada com sucesso!');
  console.log('✅ ========================================\n');
  console.log('📧 CONTA MASTER CRIADA:');
  console.log(`   Email: barroscristian39@gmail.com`);
  console.log(`   Senha: 12345678`);
  console.log('\n💡 O sistema está vazio e pronto para:');
  console.log('   ✓ Criar novas empresas');
  console.log('   ✓ Adicionar usuários por empresa');
  console.log('   ✓ Registrar técnicos responsáveis');
  console.log('   ✓ Cadastrar demandas, projetos e evidências');
  console.log('\n========================================\n');
}

main()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
