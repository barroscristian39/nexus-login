-- AlterEnum
ALTER TYPE "public"."TipoUsuario" ADD VALUE 'TECNICO';

-- CreateTable
CREATE TABLE "public"."TecnicoResponsavel" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "especialidade" TEXT,
    "certificacoes" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "demandas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TecnicoResponsavel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TecnicoResponsavel_usuarioId_key" ON "public"."TecnicoResponsavel"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."TecnicoResponsavel" ADD CONSTRAINT "TecnicoResponsavel_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
