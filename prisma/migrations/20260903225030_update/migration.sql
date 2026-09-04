-- AlterTable
ALTER TABLE "Atendimento" ADD COLUMN     "procedimentoFilhoId" TEXT;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_procedimentoFilhoId_fkey" FOREIGN KEY ("procedimentoFilhoId") REFERENCES "TipoAtendimentoOpcao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
