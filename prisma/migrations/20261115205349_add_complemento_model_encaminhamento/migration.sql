-- AlterTable
ALTER TABLE "Encaminhamento" ADD COLUMN     "dataDeAgendamentoLocal" DATE,
ADD COLUMN     "dataDeSaida" DATE,
ADD COLUMN     "prestadorExecutanteId" INTEGER;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_prestadorExecutanteId_fkey" FOREIGN KEY ("prestadorExecutanteId") REFERENCES "Prestador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
