-- CreateEnum
CREATE TYPE "TipoDeEncaminhamento" AS ENUM ('CONSULTA', 'PROCEDIMENTO');

-- CreateTable
CREATE TABLE "Encaminhamento" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoDeEncaminhamento" NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "unidadeDeOrigemId" INTEGER NOT NULL,
    "dataDeEntrada" DATE NOT NULL,
    "medicoSolicitanteId" INTEGER,
    "especialidadeDoPrestadorId" INTEGER,
    "categoria" "CategoriaEspecialidade",
    "tipoDeConsulta" "TipoDeConsulta",
    "especialidadeEncaminhadaId" INTEGER,
    "tipoDeCirurgia" TEXT,
    "procedimentoId" INTEGER,
    "membroProcedimentoId" INTEGER,
    "lado" "LadoDoCorpo",
    "situacao" TEXT NOT NULL,
    "encaminhamentoRemarcado" BOOLEAN NOT NULL DEFAULT false,
    "condicaoDeRetorno" TEXT,
    "dataDoRetorno" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encaminhamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_unidadeDeOrigemId_fkey" FOREIGN KEY ("unidadeDeOrigemId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_medicoSolicitanteId_fkey" FOREIGN KEY ("medicoSolicitanteId") REFERENCES "Prestador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_especialidadeDoPrestadorId_fkey" FOREIGN KEY ("especialidadeDoPrestadorId") REFERENCES "Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_especialidadeEncaminhadaId_fkey" FOREIGN KEY ("especialidadeEncaminhadaId") REFERENCES "Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_membroProcedimentoId_fkey" FOREIGN KEY ("membroProcedimentoId") REFERENCES "MembroProcedimento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
