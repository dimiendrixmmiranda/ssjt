-- CreateTable
CREATE TABLE "Especialidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profissional" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "especialidadeId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_codigo_key" ON "Especialidade"("codigo");

-- CreateIndex
CREATE INDEX "Especialidade_ativo_idx" ON "Especialidade"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_crm_key" ON "Profissional"("crm");

-- CreateIndex
CREATE INDEX "Profissional_especialidadeId_idx" ON "Profissional"("especialidadeId");

-- CreateIndex
CREATE INDEX "Profissional_ativo_idx" ON "Profissional"("ativo");

-- AddForeignKey
ALTER TABLE "Profissional" ADD CONSTRAINT "Profissional_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
