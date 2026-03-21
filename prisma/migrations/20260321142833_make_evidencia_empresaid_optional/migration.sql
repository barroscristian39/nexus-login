-- DropForeignKey
ALTER TABLE "public"."Evidencia" DROP CONSTRAINT "Evidencia_empresaId_fkey";

-- AlterTable
ALTER TABLE "public"."Evidencia" ALTER COLUMN "empresaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
