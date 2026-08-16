/*
  Warnings:

  - You are about to drop the `Especialidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profissional` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profissional" DROP CONSTRAINT "Profissional_especialidadeId_fkey";

-- DropTable
DROP TABLE "Especialidade";

-- DropTable
DROP TABLE "Profissional";

-- CreateTable
CREATE TABLE "Medico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "especialidadeId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medico_crm_key" ON "Medico"("crm");

-- CreateIndex
CREATE INDEX "Medico_especialidadeId_idx" ON "Medico"("especialidadeId");

-- CreateIndex
CREATE INDEX "Medico_ativo_idx" ON "Medico"("ativo");
