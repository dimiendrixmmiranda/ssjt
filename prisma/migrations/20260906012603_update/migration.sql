/*
  Warnings:

  - You are about to drop the column `lado` on the `ProcedimentoFilho` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProcedimentoFilho" DROP COLUMN "lado";

-- DropEnum
DROP TYPE "Lado";
