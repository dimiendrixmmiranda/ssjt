/*
  Warnings:

  - You are about to drop the column `tendimentoDentroOuForaDoMunicipio` on the `Local` table. All the data in the column will be lost.
  - Added the required column `atendimentoDentroOuForaDoMunicipio` to the `Local` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Local" DROP COLUMN "tendimentoDentroOuForaDoMunicipio",
ADD COLUMN     "atendimentoDentroOuForaDoMunicipio" "AtendimentoDentroOuForaDoMunicipio" NOT NULL;
