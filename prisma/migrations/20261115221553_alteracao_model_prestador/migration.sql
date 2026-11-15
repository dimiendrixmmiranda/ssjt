-- AlterTable
ALTER TABLE "Prestador" ADD COLUMN     "localId" INTEGER,
ADD COLUMN     "tipoDeAtendimento" "TipoDeAtendimentoDoPrestador" NOT NULL DEFAULT 'ITINERANTE';

-- AddForeignKey
ALTER TABLE "Prestador" ADD CONSTRAINT "Prestador_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;
