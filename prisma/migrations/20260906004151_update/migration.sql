-- CreateEnum
CREATE TYPE "ParteDoCorpo" AS ENUM ('MAO', 'PE', 'BRACO', 'DEDO');

-- CreateEnum
CREATE TYPE "Lado" AS ENUM ('DIREITO', 'ESQUERDO');

-- CreateTable
CREATE TABLE "Procedimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedimentoFilho" (
    "id" SERIAL NOT NULL,
    "parteDoCorpo" "ParteDoCorpo",
    "lado" "Lado",
    "procedimentoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedimentoFilho_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Procedimento_codigo_key" ON "Procedimento"("codigo");

-- AddForeignKey
ALTER TABLE "ProcedimentoFilho" ADD CONSTRAINT "ProcedimentoFilho_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
