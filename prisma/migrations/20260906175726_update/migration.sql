-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "unidadeDeOrigemId" INTEGER;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_unidadeDeOrigemId_fkey" FOREIGN KEY ("unidadeDeOrigemId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;
