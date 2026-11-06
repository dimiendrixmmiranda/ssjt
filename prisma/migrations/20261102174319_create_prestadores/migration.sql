-- CreateTable
CREATE TABLE "Prestador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoDoPrestador" NOT NULL,
    "cor" VARCHAR(7) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrestadorEspecialidade" (
    "prestadorId" INTEGER NOT NULL,
    "especialidadeId" INTEGER NOT NULL,

    CONSTRAINT "PrestadorEspecialidade_pkey" PRIMARY KEY ("prestadorId","especialidadeId")
);

-- CreateTable
CREATE TABLE "PrestadorProcedimento" (
    "prestadorId" INTEGER NOT NULL,
    "procedimentoId" INTEGER NOT NULL,

    CONSTRAINT "PrestadorProcedimento_pkey" PRIMARY KEY ("prestadorId","procedimentoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prestador_cor_key" ON "Prestador"("cor");

-- AddForeignKey
ALTER TABLE "PrestadorEspecialidade" ADD CONSTRAINT "PrestadorEspecialidade_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorEspecialidade" ADD CONSTRAINT "PrestadorEspecialidade_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorProcedimento" ADD CONSTRAINT "PrestadorProcedimento_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorProcedimento" ADD CONSTRAINT "PrestadorProcedimento_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
