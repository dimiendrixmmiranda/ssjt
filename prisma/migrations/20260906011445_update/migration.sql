/*
  Warnings:

  - You are about to drop the column `parteDoCorpo` on the `ProcedimentoFilho` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProcedimentoFilho" DROP COLUMN "parteDoCorpo",
ADD COLUMN     "nome" TEXT;

-- DropEnum
DROP TYPE "ParteDoCorpo";
