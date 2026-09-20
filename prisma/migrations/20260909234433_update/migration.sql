-- CreateEnum
CREATE TYPE "CondicaoDeRetorno" AS ENUM ('COM_EXAMES_PRONTOS', 'DETERMINADO_PERIODO_DE_TEMPO');

-- CreateEnum
CREATE TYPE "Lado" AS ENUM ('DIREITO', 'ESQUERDO', 'SUPERIOR', 'INFERIOR');

-- CreateEnum
CREATE TYPE "TipoAgendamento" AS ENUM ('CONSULTA', 'PROCEDIMENTO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('EM_ESPERA', 'AGENDADO', 'BLOQUEADO', 'TIRADO_DA_FILA');

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoAgendamento" NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "unidadeDeOrigemId" INTEGER NOT NULL,
    "dataDeEntrada" TIMESTAMP(3) NOT NULL,
    "medicoSolicitanteId" INTEGER,
    "especialidadeId" INTEGER,
    "especialidadeFilhaId" INTEGER,
    "tipoDeConsulta" "TipoDeConsulta",
    "procedimentoId" INTEGER,
    "procedimentoFilhoId" INTEGER,
    "lado" "Lado",
    "prioridade" "Prioridade" NOT NULL,
    "condicaoDeRetorno" "CondicaoDeRetorno",
    "dataDoRetorno" TIMESTAMP(3),
    "encaminhamentoRemarcado" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'EM_ESPERA',
    "dataDoAgendamento" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_unidadeDeOrigemId_fkey" FOREIGN KEY ("unidadeDeOrigemId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_medicoSolicitanteId_fkey" FOREIGN KEY ("medicoSolicitanteId") REFERENCES "Medico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_especialidadeFilhaId_fkey" FOREIGN KEY ("especialidadeFilhaId") REFERENCES "EspecialidadeFilha"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_procedimentoFilhoId_fkey" FOREIGN KEY ("procedimentoFilhoId") REFERENCES "ProcedimentoFilho"("id") ON DELETE SET NULL ON UPDATE CASCADE;
