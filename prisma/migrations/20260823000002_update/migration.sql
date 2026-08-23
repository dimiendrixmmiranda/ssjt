/*
  Warnings:

  - Changed the type of `situacao` on the `Atendimento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('URGENTE', 'PRIORIDADE', 'NORMAL');

-- AlterTable
ALTER TABLE "Atendimento" DROP COLUMN "situacao",
ADD COLUMN     "situacao" "Prioridade" NOT NULL;

-- DropEnum
DROP TYPE "Situacao";

-- CreateIndex
CREATE INDEX "Atendimento_situacao_idx" ON "Atendimento"("situacao");
