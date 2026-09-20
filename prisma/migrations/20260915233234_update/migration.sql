/*
  Warnings:

  - Added the required column `localDeAtendimentoId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prestadorId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "dataDeSaida" TIMESTAMP(3),
ADD COLUMN     "localDeAtendimentoId" INTEGER NOT NULL,
ADD COLUMN     "prestadorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_localDeAtendimentoId_fkey" FOREIGN KEY ("localDeAtendimentoId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
