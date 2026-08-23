-- CreateEnum
CREATE TYPE "TipoDeConsulta" AS ENUM ('PRIMEIRA_CONSULTA', 'RETORNO');

-- CreateEnum
CREATE TYPE "Situacao" AS ENUM ('URGENTE', 'PRIORIDADE', 'NORMAL');

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "unidadeDeOrigemId" TEXT NOT NULL,
    "dataDeEntrada" TIMESTAMP(3) NOT NULL,
    "medicoSolicitanteId" TEXT NOT NULL,
    "especialidadeDoMedicoSolicitante" TEXT NOT NULL,
    "categoriaAtendimento" "CategoriaAtendimento" NOT NULL,
    "especialidadeId" TEXT NOT NULL,
    "situacao" "Situacao" NOT NULL,
    "tipoDeConsulta" "TipoDeConsulta",

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Atendimento_pacienteId_idx" ON "Atendimento"("pacienteId");

-- CreateIndex
CREATE INDEX "Atendimento_unidadeDeOrigemId_idx" ON "Atendimento"("unidadeDeOrigemId");

-- CreateIndex
CREATE INDEX "Atendimento_medicoSolicitanteId_idx" ON "Atendimento"("medicoSolicitanteId");

-- CreateIndex
CREATE INDEX "Atendimento_especialidadeId_idx" ON "Atendimento"("especialidadeId");

-- CreateIndex
CREATE INDEX "Atendimento_categoriaAtendimento_idx" ON "Atendimento"("categoriaAtendimento");

-- CreateIndex
CREATE INDEX "Atendimento_situacao_idx" ON "Atendimento"("situacao");

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_unidadeDeOrigemId_fkey" FOREIGN KEY ("unidadeDeOrigemId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_medicoSolicitanteId_fkey" FOREIGN KEY ("medicoSolicitanteId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "TipoAtendimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
