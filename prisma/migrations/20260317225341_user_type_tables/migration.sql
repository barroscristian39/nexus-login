-- CreateEnum
CREATE TYPE "public"."Perfil" AS ENUM ('MASTER', 'ADMIN_EMPRESA', 'GESTOR', 'SUPERVISOR', 'OPERADOR', 'VISUALIZADOR');

-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('MASTER', 'PRINCIPAL', 'SUBUSUARIO');

-- CreateEnum
CREATE TYPE "public"."StatusRegistro" AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE', 'BLOQUEADO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "public"."StatusProjeto" AS ENUM ('PLANEJAMENTO', 'EM_ANDAMENTO', 'EM_REVISAO', 'CONCLUIDO', 'ATRASADO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "public"."PrioridadeDemanda" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "public"."StatusDemanda" AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'EM_REVISAO', 'CONCLUIDA', 'ATRASADA', 'BLOQUEADA');

-- CreateEnum
CREATE TYPE "public"."StatusEvidencia" AS ENUM ('PENDENTE', 'VALIDA', 'ATRASADA', 'REJEITADA');

-- CreateTable
CREATE TABLE "public"."Empresa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "plano" TEXT NOT NULL,
    "status" "public"."StatusRegistro" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT,
    "usuarioPaiId" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senhaHash" TEXT NOT NULL,
    "perfil" "public"."Perfil" NOT NULL,
    "tipoUsuario" "public"."TipoUsuario" NOT NULL,
    "status" "public"."StatusRegistro" NOT NULL DEFAULT 'ATIVO',
    "setor" TEXT,
    "ultimoAcesso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MasterUsuario" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsuarioPrincipal" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsuarioPrincipal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subusuario" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subusuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Projeto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "responsavelId" TEXT,
    "status" "public"."StatusProjeto" NOT NULL DEFAULT 'PLANEJAMENTO',
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "dataInicio" TIMESTAMP(3),
    "dataPrevista" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Demanda" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "projetoId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "responsavelId" TEXT,
    "prioridade" "public"."PrioridadeDemanda" NOT NULL DEFAULT 'MEDIA',
    "status" "public"."StatusDemanda" NOT NULL DEFAULT 'ABERTA',
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "vencimento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Demanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evidencia" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "demandaId" TEXT,
    "projetoId" TEXT,
    "nomeArquivo" TEXT NOT NULL,
    "tipoArquivo" TEXT NOT NULL,
    "responsavelId" TEXT,
    "status" "public"."StatusEvidencia" NOT NULL DEFAULT 'PENDENTE',
    "dataEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "urlArquivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comentario" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "projetoId" TEXT,
    "demandaId" TEXT,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notificacao" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "public"."Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MasterUsuario_usuarioId_key" ON "public"."MasterUsuario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioPrincipal_usuarioId_key" ON "public"."UsuarioPrincipal"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Subusuario_usuarioId_key" ON "public"."Subusuario"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_usuarioPaiId_fkey" FOREIGN KEY ("usuarioPaiId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MasterUsuario" ADD CONSTRAINT "MasterUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioPrincipal" ADD CONSTRAINT "UsuarioPrincipal_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subusuario" ADD CONSTRAINT "Subusuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Projeto" ADD CONSTRAINT "Projeto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Projeto" ADD CONSTRAINT "Projeto_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Demanda" ADD CONSTRAINT "Demanda_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Demanda" ADD CONSTRAINT "Demanda_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "public"."Projeto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Demanda" ADD CONSTRAINT "Demanda_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."Demanda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "public"."Projeto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comentario" ADD CONSTRAINT "Comentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comentario" ADD CONSTRAINT "Comentario_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "public"."Projeto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comentario" ADD CONSTRAINT "Comentario_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."Demanda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notificacao" ADD CONSTRAINT "Notificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
