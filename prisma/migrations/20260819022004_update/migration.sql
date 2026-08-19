-- CreateEnum
CREATE TYPE "TipoLocal" AS ENUM ('POSTO_DE_SAUDE', 'CLINICA', 'HOSPITAL');

-- CreateEnum
CREATE TYPE "StatusLocal" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "Local" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoDoLocal" "TipoLocal" NOT NULL,
    "status" "StatusLocal" NOT NULL DEFAULT 'ATIVO',
    "cidade" TEXT NOT NULL,
    "cep" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "bairro" TEXT,
    "complemento" TEXT,
    "telefone1" TEXT,
    "telefone2" TEXT,
    "email" TEXT,
    "descricao" TEXT,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalTipoAtendimento" (
    "id" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "tipoAtendimentoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocalTipoAtendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Local_nome_idx" ON "Local"("nome");

-- CreateIndex
CREATE INDEX "Local_cidade_idx" ON "Local"("cidade");

-- CreateIndex
CREATE INDEX "Local_status_idx" ON "Local"("status");

-- CreateIndex
CREATE INDEX "LocalTipoAtendimento_localId_idx" ON "LocalTipoAtendimento"("localId");

-- CreateIndex
CREATE INDEX "LocalTipoAtendimento_tipoAtendimentoId_idx" ON "LocalTipoAtendimento"("tipoAtendimentoId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalTipoAtendimento_localId_tipoAtendimentoId_key" ON "LocalTipoAtendimento"("localId", "tipoAtendimentoId");

-- AddForeignKey
ALTER TABLE "LocalTipoAtendimento" ADD CONSTRAINT "LocalTipoAtendimento_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalTipoAtendimento" ADD CONSTRAINT "LocalTipoAtendimento_tipoAtendimentoId_fkey" FOREIGN KEY ("tipoAtendimentoId") REFERENCES "TipoAtendimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
