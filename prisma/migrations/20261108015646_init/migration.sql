-- CreateEnum
CREATE TYPE "TipoDeConta" AS ENUM ('SENIOR_ADMIN');

-- CreateEnum
CREATE TYPE "TipoDeLocal" AS ENUM ('HOSPITAL', 'CLINICA', 'POSTO_DE_SAUDE', 'LABORATORIO', 'OUTRO');

-- CreateEnum
CREATE TYPE "AtendimentoDentroOuForaDoMunicipio" AS ENUM ('DENTRO_DO_MUNICIPIO', 'FORA_DO_MUNICIPIO');

-- CreateEnum
CREATE TYPE "CategoriaEspecialidade" AS ENUM ('NORMAL', 'TFD');

-- CreateEnum
CREATE TYPE "TipoProcedimento" AS ENUM ('COMUM', 'COM_MEMBROS');

-- CreateEnum
CREATE TYPE "Lateralidade" AS ENUM ('SEM_LADO', 'COM_LADO');

-- CreateEnum
CREATE TYPE "TipoDoPrestador" AS ENUM ('MEDICO', 'PRESTADOR_DE_SERVICOS_MEDICOS');

-- CreateEnum
CREATE TYPE "PeriodoDeAtendimento" AS ENUM ('MANHA', 'TARDE', 'NOITE');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "Raca" AS ENUM ('BRANCA', 'PRETA', 'PARDA', 'AMARELA', 'INDIGENA', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "TipoSanguineo" AS ENUM ('A', 'B', 'AB', 'O');

-- CreateEnum
CREATE TYPE "FatorRH" AS ENUM ('POSITIVO', 'NEGATIVO');

-- CreateEnum
CREATE TYPE "UF" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- CreateEnum
CREATE TYPE "GrauDeEscolaridade" AS ENUM ('NAO_ALFABETIZADO', 'FUNDAMENTAL_INCOMPLETO', 'FUNDAMENTAL_COMPLETO', 'MEDIO_INCOMPLETO', 'MEDIO_COMPLETO', 'SUPERIOR_INCOMPLETO', 'SUPERIOR_COMPLETO', 'POS_GRADUACAO');

-- CreateEnum
CREATE TYPE "TipoDeLogradouro" AS ENUM ('RUA', 'AVENIDA', 'ALAMEDA', 'ESTRADA', 'RODOVIA', 'TRAVESSA', 'PRACA', 'OUTRO');

-- CreateEnum
CREATE TYPE "Zona" AS ENUM ('URBANA', 'RURAL');

-- CreateEnum
CREATE TYPE "Deficiencia" AS ENUM ('FISICA', 'VISUAL', 'AUDITIVA', 'INTELECTUAL', 'MULTIPLA', 'TEA');

-- CreateEnum
CREATE TYPE "TipoDeCadastroPaciente" AS ENUM ('PROVISORIO', 'COMPLETO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imagem" TEXT,
    "dataDeNascimento" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "senhaHash" TEXT NOT NULL,
    "tipoDeConta" "TipoDeConta" NOT NULL DEFAULT 'SENIOR_ADMIN',
    "localId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Local" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoDeLocal" "TipoDeLocal" NOT NULL,
    "atendimentoDentroOuForaDoMunicipio" "AtendimentoDentroOuForaDoMunicipio" NOT NULL,
    "quantidadeDeSalas" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "cidade" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "complemento" TEXT,
    "telefone1" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "categoria" "CategoriaEspecialidade"[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoProcedimento" NOT NULL DEFAULT 'COMUM',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembroProcedimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "lateralidade" "Lateralidade" NOT NULL DEFAULT 'SEM_LADO',
    "procedimentoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembroProcedimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoDoPrestador" NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "tipoDeCadastro" "TipoDeCadastroPaciente" NOT NULL DEFAULT 'COMPLETO',
    "nomeDoPaciente" TEXT NOT NULL,
    "nomeSocial" TEXT,
    "nomeDaMae" TEXT,
    "nomeDoPai" TEXT,
    "dataDeNascimento" DATE NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "estadoCivil" "EstadoCivil",
    "corERaca" "Raca",
    "unidadeDeSaudeId" INTEGER NOT NULL,
    "codigoGSUS" TEXT,
    "codigoIDS" TEXT,
    "tipoSanguineo" "TipoSanguineo",
    "fatorRH" "FatorRH",
    "nacionalidade" TEXT,
    "municipioDeNascimento" TEXT,
    "ufDeNascimento" "UF",
    "CPF" TEXT,
    "cartaoDoSus" TEXT,
    "NIS" TEXT,
    "RG" TEXT,
    "orgaoEmissorDoRG" TEXT,
    "ufDoRG" "UF",
    "dataDaEmissaoDoRG" DATE,
    "cnsMae" TEXT,
    "orientacaoRegCpf" TEXT,
    "tituloDeEleitor" TEXT,
    "zonaEleitoral" TEXT,
    "secaoEleitoral" TEXT,
    "CTPSNumero" TEXT,
    "CTPSSerie" TEXT,
    "cTPSUf" "UF",
    "CTPSDataEmissao" DATE,
    "PISPASEP" TEXT,
    "frequentaEscola" TEXT,
    "escola" TEXT,
    "serieEscolar" TEXT,
    "grauEscolaridade" "GrauDeEscolaridade",
    "cursoProfissionalizante" TEXT,
    "paisDeOrigem" TEXT,
    "entradaNoBrasil" DATE,
    "email" TEXT,
    "telefone" TEXT,
    "telefoneWhatsApp" TEXT,
    "nomeContatoEmergencia" TEXT,
    "parentescoContatoEmergencia" TEXT,
    "telefoneDeEmergencia" TEXT,
    "nomeDoResponsavel" TEXT,
    "CPFDoResponsavel" TEXT,
    "parentescoDoResponsavel" TEXT,
    "telefoneDoResponsavel" TEXT,
    "pais" TEXT,
    "UF" "UF",
    "municipio" TEXT,
    "bairro" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "CEP" TEXT,
    "tipoLogradouro" "TipoDeLogradouro",
    "pontoDeReferencia" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "zona" "Zona",
    "possuiDeficiencia" BOOLEAN NOT NULL DEFAULT false,
    "tipoDeDeficiencia" "Deficiencia"[] DEFAULT ARRAY[]::"Deficiencia"[],
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_codigo_key" ON "Especialidade"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Procedimento_nome_key" ON "Procedimento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Procedimento_codigo_key" ON "Procedimento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "MembroProcedimento_nome_procedimentoId_key" ON "MembroProcedimento"("nome", "procedimentoId");

-- CreateIndex
CREATE UNIQUE INDEX "Prestador_cor_key" ON "Prestador"("cor");

-- CreateIndex
CREATE UNIQUE INDEX "AgendamentoDePrestador_data_unidadeDeAtendimentoId_salaNume_key" ON "AgendamentoDePrestador"("data", "unidadeDeAtendimentoId", "salaNumero", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_CPF_key" ON "Paciente"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cartaoDoSus_key" ON "Paciente"("cartaoDoSus");

-- CreateIndex
CREATE INDEX "Paciente_nomeDoPaciente_idx" ON "Paciente"("nomeDoPaciente");

-- CreateIndex
CREATE INDEX "Paciente_dataDeNascimento_idx" ON "Paciente"("dataDeNascimento");

-- CreateIndex
CREATE INDEX "Paciente_unidadeDeSaudeId_idx" ON "Paciente"("unidadeDeSaudeId");

-- CreateIndex
CREATE INDEX "Paciente_tipoDeCadastro_idx" ON "Paciente"("tipoDeCadastro");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroProcedimento" ADD CONSTRAINT "MembroProcedimento_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorEspecialidade" ADD CONSTRAINT "PrestadorEspecialidade_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorEspecialidade" ADD CONSTRAINT "PrestadorEspecialidade_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorProcedimento" ADD CONSTRAINT "PrestadorProcedimento_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorProcedimento" ADD CONSTRAINT "PrestadorProcedimento_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoDePrestador" ADD CONSTRAINT "AgendamentoDePrestador_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoDePrestador" ADD CONSTRAINT "AgendamentoDePrestador_unidadeDeAtendimentoId_fkey" FOREIGN KEY ("unidadeDeAtendimentoId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoDePrestador" ADD CONSTRAINT "AgendamentoDePrestador_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_unidadeDeSaudeId_fkey" FOREIGN KEY ("unidadeDeSaudeId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
