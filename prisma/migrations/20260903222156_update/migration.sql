-- CreateTable
CREATE TABLE "TipoAtendimentoOpcao" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tipoAtendimentoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoAtendimentoOpcao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TipoAtendimentoOpcao_tipoAtendimentoId_idx" ON "TipoAtendimentoOpcao"("tipoAtendimentoId");

-- AddForeignKey
ALTER TABLE "TipoAtendimentoOpcao" ADD CONSTRAINT "TipoAtendimentoOpcao_tipoAtendimentoId_fkey" FOREIGN KEY ("tipoAtendimentoId") REFERENCES "TipoAtendimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
