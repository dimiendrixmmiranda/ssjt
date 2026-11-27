-- AlterEnum
ALTER TYPE "PossibilidadeDeRetorno" ADD VALUE 'EXAMES_PRONTOS';

-- AlterTable
ALTER TABLE "Encaminhamento" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Encaminhamento_id_seq";
