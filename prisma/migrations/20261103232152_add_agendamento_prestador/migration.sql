-- CreateTable
CREATE TABLE "AgendamentoDePrestador" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "prestadorId" INTEGER NOT NULL,
    "unidadeDeAtendimentoId" INTEGER NOT NULL,
    "periodo" "PeriodoDeAtendimento" NOT NULL,
    "salaNumero" INTEGER NOT NULL,
    "observacoes" TEXT,
    "criadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendamentoDePrestador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgendamentoDePrestador_data_unidadeDeAtendimentoId_salaNume_key" ON "AgendamentoDePrestador"("data", "unidadeDeAtendimentoId", "salaNumero", "periodo");

-- AddForeignKey
ALTER TABLE "AgendamentoDePrestador" ADD CONSTRAINT "AgendamentoDePrestador_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoDePrestador" ADD CONSTRAINT "AgendamentoDePrestador_unidadeDeAtendimentoId_fkey" FOREIGN KEY ("unidadeDeAtendimentoId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoDePrestador" ADD CONSTRAINT "AgendamentoDePrestador_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
