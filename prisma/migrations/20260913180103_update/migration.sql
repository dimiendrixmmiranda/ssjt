-- CreateEnum
CREATE TYPE "RedeLocal" AS ENUM ('REDE_MUNICIPAL', 'REDE_REFERENCIADA');

-- AlterTable
ALTER TABLE "Local" ADD COLUMN     "rede" "RedeLocal";
