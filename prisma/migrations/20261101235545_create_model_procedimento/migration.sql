-- CreateEnum
CREATE TYPE "TipoProcedimento" AS ENUM ('COMUM', 'COM_MEMBROS');

-- CreateEnum
CREATE TYPE "Lateralidade" AS ENUM ('SEM_LADO', 'COM_LADO');

-- CreateTable
CREATE TABLE "Procedimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoProcedimento" NOT NULL DEFAULT 'COMUM',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembroProcedimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "lateralidade" "Lateralidade" NOT NULL DEFAULT 'SEM_LADO',
    "procedimentoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembroProcedimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Procedimento_nome_key" ON "Procedimento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Procedimento_codigo_key" ON "Procedimento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "MembroProcedimento_nome_procedimentoId_key" ON "MembroProcedimento"("nome", "procedimentoId");

-- AddForeignKey
ALTER TABLE "MembroProcedimento" ADD CONSTRAINT "MembroProcedimento_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
