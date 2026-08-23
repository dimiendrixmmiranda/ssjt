/*
  Warnings:

  - You are about to drop the column `povoTradicional` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `religiao` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `situacaoFamiliar` on the `Paciente` table. All the data in the column will be lost.
  - Added the required column `telefone1` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "povoTradicional",
DROP COLUMN "religiao",
DROP COLUMN "situacaoFamiliar",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "telefone1" TEXT NOT NULL,
ADD COLUMN     "telefone2" TEXT;
