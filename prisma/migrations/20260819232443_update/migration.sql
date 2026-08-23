/*
  Warnings:

  - You are about to drop the `Medico` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoPrestador" AS ENUM ('MEDICO', 'LABORATORIO');

-- DropTable
DROP TABLE "Medico";

-- CreateTable
CREATE TABLE "Prestador" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoPrestador" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "descricao" TEXT,
    "crm" TEXT,
    "especialidadeId" TEXT,

    CONSTRAINT "Prestador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prestador_crm_key" ON "Prestador"("crm");

-- CreateIndex
CREATE INDEX "Prestador_nome_idx" ON "Prestador"("nome");

-- CreateIndex
CREATE INDEX "Prestador_tipo_idx" ON "Prestador"("tipo");

-- CreateIndex
CREATE INDEX "Prestador_ativo_idx" ON "Prestador"("ativo");
