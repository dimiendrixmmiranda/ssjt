-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_localDeAtendimentoId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_prestadorId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" ALTER COLUMN "dataDoAgendamento" DROP NOT NULL,
ALTER COLUMN "localDeAtendimentoId" DROP NOT NULL,
ALTER COLUMN "prestadorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_localDeAtendimentoId_fkey" FOREIGN KEY ("localDeAtendimentoId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
