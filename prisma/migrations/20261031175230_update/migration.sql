-- CreateEnum
CREATE TYPE "TipoDeLocal" AS ENUM ('HOSPITAL', 'CLINICA', 'POSTO_DE_SAUDE', 'LABORATORIO', 'OUTRO');

-- CreateEnum
CREATE TYPE "AtendimentoDentroOuForaDoMunicipio" AS ENUM ('DENTRO_DO_MUNICIPIO', 'FORA_DO_MUNICIPIO');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "localId" INTEGER;

-- CreateTable
CREATE TABLE "Local" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoDeLocal" "TipoDeLocal" NOT NULL,
    "tendimentoDentroOuForaDoMunicipio" "AtendimentoDentroOuForaDoMunicipio" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "cidade" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "complemento" TEXT,
    "telefone1" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;
