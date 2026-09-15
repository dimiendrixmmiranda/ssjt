-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'PREFIRO_NAO_DIZER');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "CorRaca" AS ENUM ('BRANCA', 'PRETA', 'PARDA', 'AMARELA', 'INDIGENA', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "TipoSanguineo" AS ENUM ('A', 'B', 'AB', 'O');

-- CreateEnum
CREATE TYPE "FatorRh" AS ENUM ('POSITIVO', 'NEGATIVO');

-- CreateEnum
CREATE TYPE "SimNao" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "OrgaoEmissor" AS ENUM ('SSP', 'DETRAN', 'POLICIA_CIVIL', 'OUTRO');

-- CreateEnum
CREATE TYPE "GrauEscolaridade" AS ENUM ('FUNDAMENTAL_INCOMPLETO', 'FUNDAMENTAL_COMPLETO', 'MEDIO_INCOMPLETO', 'MEDIO_COMPLETO', 'SUPERIOR_INCOMPLETO', 'SUPERIOR_COMPLETO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO');

-- CreateEnum
CREATE TYPE "Pais" AS ENUM ('BRASIL', 'OUTRO');

-- CreateEnum
CREATE TYPE "Zona" AS ENUM ('URBANA', 'RURAL');

-- CreateEnum
CREATE TYPE "TipoPrestador" AS ENUM ('MEDICO', 'LABORATORIO');

-- CreateEnum
CREATE TYPE "TipoDeConsulta" AS ENUM ('PRIMEIRA_CONSULTA', 'RETORNO');

-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('URGENTE', 'PRIORIDADE', 'NORMAL');

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "idPaciente" TEXT,
    "nome" TEXT NOT NULL,
    "nomeSocial" TEXT,
    "declaroNaoPossuirNomeSocial" BOOLEAN NOT NULL DEFAULT false,
    "nomeDaMae" TEXT NOT NULL,
    "nomeDoPai" TEXT,
    "dataDeNascimento" TIMESTAMP(3) NOT NULL,
    "sexo" "Sexo",
    "estadoCivil" "EstadoCivil",
    "corRaca" "CorRaca",
    "cpf" TEXT NOT NULL,
    "cartaoSus" TEXT,
    "nis" TEXT,
    "unidadeDeSaude" TEXT,
    "codigoGsus" TEXT,
    "codigoIds" TEXT,
    "tipoSanguineo" "TipoSanguineo",
    "fatorRh" "FatorRh",
    "observacoes" TEXT,
    "telefone1" TEXT NOT NULL,
    "telefone2" TEXT,
    "email" TEXT,
    "rg" TEXT,
    "orgaoEmissor" "OrgaoEmissor",
    "ufRg" TEXT,
    "dataEmissaoRg" TIMESTAMP(3),
    "cpfRegular" "SimNao",
    "cpfCns" TEXT,
    "cnsMae" TEXT,
    "orientacaoRegCpf" "SimNao",
    "tituloEleitor" TEXT,
    "zonaEleitoral" TEXT,
    "secaoEleitoral" TEXT,
    "ctpsNumero" TEXT,
    "ctpsSerie" TEXT,
    "ctpsUf" TEXT,
    "ctpsDataEmissao" TIMESTAMP(3),
    "pisPasep" TEXT,
    "frequentaEscola" "SimNao",
    "escola" TEXT,
    "serieEscolar" TEXT,
    "grauEscolaridade" "GrauEscolaridade",
    "cursoProfissionalizante" TEXT,
    "paisOrigem" TEXT,
    "entradaBrasil" TIMESTAMP(3),
    "numeroPortaria" TEXT,
    "dataNaturalizacao" TIMESTAMP(3),
    "pais" "Pais",
    "uf" TEXT,
    "municipio" TEXT,
    "cep" TEXT,
    "bairro" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "zona" "Zona",
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");
