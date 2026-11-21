/*
  Warnings:

  - You are about to drop the `Agendamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_encaminhamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_localDeAtendimentoId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_prestadorId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_unidadeDeOrigemId_fkey";

-- AlterTable
ALTER TABLE "Encaminhamento" ADD COLUMN     "localDeAtendimentoId" INTEGER;

-- DropTable
DROP TABLE "Agendamento";

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_localDeAtendimentoId_fkey" FOREIGN KEY ("localDeAtendimentoId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;
