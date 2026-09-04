import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CategoriaAtendimento, Prioridade, TipoDeConsulta } from "@/app/generated/prisma/client";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            pacienteId,
            unidadeDeOrigemId,
            dataDeEntrada,
            medicoSolicitanteId,
            especialidadeDoMedicoSolicitante,
            categoriaAtendimento,
            especialidadeId,
            procedimentoFilhoId, // ← ADICIONE
            situacao,
            tipoDeConsulta,
        } = body;

        // =========================
        // VALIDAÇÕES
        // =========================

        if (!pacienteId) {
            return NextResponse.json(
                { erro: "Paciente é obrigatório." },
                { status: 400 }
            );
        }

        if (!unidadeDeOrigemId) {
            return NextResponse.json(
                { erro: "Unidade de origem é obrigatória." },
                { status: 400 }
            );
        }

        if (!dataDeEntrada) {
            return NextResponse.json(
                { erro: "Data de entrada é obrigatória." },
                { status: 400 }
            );
        }

        if (!medicoSolicitanteId) {
            return NextResponse.json(
                { erro: "Médico solicitante é obrigatório." },
                { status: 400 }
            );
        }

        if (!especialidadeDoMedicoSolicitante) {
            return NextResponse.json(
                { erro: "Especialidade do médico solicitante é obrigatória." },
                { status: 400 }
            );
        }

        if (!categoriaAtendimento) {
            return NextResponse.json(
                { erro: "Categoria de atendimento é obrigatória." },
                { status: 400 }
            );
        }

        if (!especialidadeId) {
            return NextResponse.json(
                { erro: "Especialidade/procedimento é obrigatório." },
                { status: 400 }
            );
        }

        if (
            categoriaAtendimento === CategoriaAtendimento.PROCEDIMENTO &&
            !procedimentoFilhoId
        ) {
            return NextResponse.json(
                { erro: "Procedimento filho é obrigatório para procedimentos." },
                { status: 400 }
            );
        }

        let procedimentoFilho = null;

        if (procedimentoFilhoId) {
            procedimentoFilho = await prisma.tipoAtendimentoOpcao.findUnique({
                where: {
                    id: procedimentoFilhoId,
                },
            });

            if (!procedimentoFilho) {
                return NextResponse.json(
                    { erro: "Procedimento filho não encontrado." },
                    { status: 404 }
                );
            }

            if (procedimentoFilho.tipoAtendimentoId !== especialidadeId) {
                return NextResponse.json(
                    {
                        erro: "O procedimento filho não pertence à especialidade selecionada.",
                    },
                    { status: 400 }
                );
            }
        }

        if (!situacao) {
            return NextResponse.json(
                { erro: "Situação é obrigatória." },
                { status: 400 }
            );
        }

        // Tipo de consulta só é necessário para CONSULTA
        if (
            categoriaAtendimento === CategoriaAtendimento.CONSULTA &&
            !tipoDeConsulta
        ) {
            return NextResponse.json(
                { erro: "Tipo de consulta é obrigatório para consultas." },
                { status: 400 }
            );
        }

        // =========================
        // VALIDAÇÃO DOS ENUMS
        // =========================

        if (
            !Object.values(CategoriaAtendimento).includes(
                categoriaAtendimento
            )
        ) {
            return NextResponse.json(
                { erro: "Categoria de atendimento inválida." },
                { status: 400 }
            );
        }

        if (!Object.values(Prioridade).includes(situacao)) {
            return NextResponse.json(
                { erro: "Situação inválida." },
                { status: 400 }
            );
        }

        if (
            tipoDeConsulta &&
            !Object.values(TipoDeConsulta).includes(tipoDeConsulta)
        ) {
            return NextResponse.json(
                { erro: "Tipo de consulta inválido." },
                { status: 400 }
            );
        }

        // =========================
        // VERIFICA PACIENTE
        // =========================

        const paciente = await prisma.paciente.findUnique({
            where: {
                id: pacienteId,
            },
        });

        if (!paciente) {
            return NextResponse.json(
                { erro: "Paciente não encontrado." },
                { status: 404 }
            );
        }

        // =========================
        // VERIFICA UNIDADE
        // =========================

        const unidade = await prisma.local.findUnique({
            where: {
                id: unidadeDeOrigemId,
            },
        });

        if (!unidade) {
            return NextResponse.json(
                { erro: "Unidade de origem não encontrada." },
                { status: 404 }
            );
        }

        // =========================
        // VERIFICA MÉDICO
        // =========================

        const medico = await prisma.prestador.findUnique({
            where: {
                id: medicoSolicitanteId,
            },
        });

        if (!medico) {
            return NextResponse.json(
                { erro: "Médico solicitante não encontrado." },
                { status: 404 }
            );
        }

        // =========================
        // VERIFICA TIPO DE ATENDIMENTO
        // =========================

        const especialidade = await prisma.tipoAtendimento.findUnique({
            where: {
                id: especialidadeId,
            },
        });

        if (!especialidade) {
            return NextResponse.json(
                { erro: "Especialidade/procedimento não encontrado." },
                { status: 404 }
            );
        }

        // Garante que a categoria selecionada
        // corresponde à categoria cadastrada
        if (especialidade.categoria !== categoriaAtendimento) {
            return NextResponse.json(
                {
                    erro: "A especialidade/procedimento selecionado não pertence à categoria informada.",
                },
                { status: 400 }
            );
        }
        
        const atendimento = await prisma.atendimento.create({
            data: {
                pacienteId,
                unidadeDeOrigemId,
                dataDeEntrada: new Date(dataDeEntrada),
                medicoSolicitanteId,
                especialidadeDoMedicoSolicitante,
                categoriaAtendimento,
                especialidadeId,
                procedimentoFilhoId:
                    categoriaAtendimento === CategoriaAtendimento.PROCEDIMENTO
                        ? procedimentoFilhoId
                        : null,
                situacao,
                tipoDeConsulta:
                    categoriaAtendimento === CategoriaAtendimento.CONSULTA
                        ? tipoDeConsulta
                        : null,
            },
            include: {
                paciente: true,
                unidadeDeOrigem: true,
                medicoSolicitante: true,
                especialidade: true,
                procedimentoFilho: true, // ← também adicione
            },
        });

        return NextResponse.json(atendimento, {
            status: 201,
        });
    } catch (error) {
        console.error("Erro ao cadastrar atendimento:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao cadastrar atendimento.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const pacienteId = searchParams.get("pacienteId");
        const categoriaAtendimento = searchParams.get("categoriaAtendimento");
        const situacao = searchParams.get("situacao");

        const atendimentos = await prisma.atendimento.findMany({
            where: {
                ...(pacienteId && {
                    pacienteId,
                }),

                ...(categoriaAtendimento && {
                    categoriaAtendimento: categoriaAtendimento as CategoriaAtendimento,
                }),

                ...(situacao && {
                    situacao: situacao as Prioridade,
                }),
            },

            include: {
                // PACIENTE COMPLETO
                paciente: true,

                // LOCAL DE ORIGEM COMPLETO
                unidadeDeOrigem: true,

                // PRESTADOR COMPLETO
                medicoSolicitante: true,

                // TIPO DE ATENDIMENTO COMPLETO
                especialidade: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(atendimentos);

    } catch (error) {
        console.error("Erro ao buscar atendimentos:", error);

        return NextResponse.json(
            {
                erro: "Erro ao buscar atendimentos.",
            },
            {
                status: 500,
            }
        );
    }
}