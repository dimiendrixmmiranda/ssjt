-- CreateTable
CREATE TABLE "TipoDeCirurgia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "especialidadeId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TipoDeCirurgia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoDeCirurgia_nome_especialidadeId_key" ON "TipoDeCirurgia"("nome", "especialidadeId");

-- AddForeignKey
ALTER TABLE "TipoDeCirurgia" ADD CONSTRAINT "TipoDeCirurgia_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
