-- CreateTable
CREATE TABLE "Agendamento" (
    "id" SERIAL NOT NULL,
    "encaminhamentoId" INTEGER NOT NULL,
    "unidadeDeOrigemId" INTEGER,
    "convenio" "Convenio" NOT NULL,
    "prestadorId" INTEGER NOT NULL,
    "localDeAtendimentoId" INTEGER NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "status" "StatusDeAgendamento" NOT NULL DEFAULT 'AGENDADO',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agendamento_encaminhamentoId_idx" ON "Agendamento"("encaminhamentoId");

-- CreateIndex
CREATE INDEX "Agendamento_prestadorId_dataHora_idx" ON "Agendamento"("prestadorId", "dataHora");

-- CreateIndex
CREATE INDEX "Agendamento_localDeAtendimentoId_dataHora_idx" ON "Agendamento"("localDeAtendimentoId", "dataHora");

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_encaminhamentoId_fkey" FOREIGN KEY ("encaminhamentoId") REFERENCES "Encaminhamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_unidadeDeOrigemId_fkey" FOREIGN KEY ("unidadeDeOrigemId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_localDeAtendimentoId_fkey" FOREIGN KEY ("localDeAtendimentoId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
