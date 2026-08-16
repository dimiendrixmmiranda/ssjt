-- CreateEnum
CREATE TYPE "CategoriaAtendimento" AS ENUM ('CONSULTA', 'PROCEDIMENTO', 'CIRURGIA');

-- CreateTable
CREATE TABLE "TipoAtendimento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "CategoriaAtendimento" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoAtendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoAtendimento_codigo_key" ON "TipoAtendimento"("codigo");

-- CreateIndex
CREATE INDEX "TipoAtendimento_categoria_idx" ON "TipoAtendimento"("categoria");

-- CreateIndex
CREATE INDEX "TipoAtendimento_ativo_idx" ON "TipoAtendimento"("ativo");
