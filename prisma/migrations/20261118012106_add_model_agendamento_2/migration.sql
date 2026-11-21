/*
  Warnings:

  - Added the required column `dataDeSaida` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "dataDeSaida" TIMESTAMP(3) NOT NULL;
