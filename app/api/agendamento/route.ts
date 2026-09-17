import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            tipo,
            pacienteId,
            unidadeDeOrigemId,
            dataDeEntrada,

            medicoSolicitanteId,

            especialidadeId,
            especialidadeFilhaId,
            tipoDeConsulta,

            procedimentoId,
            procedimentoFilhoId,
            lado,

            prioridade,

            condicaoDeRetorno,
            dataDoRetorno,

            localDeAtendimentoId,
            prestadorId,

            encaminhamentoRemarcado,

            status,
            dataDoAgendamento,
            ativo,
        } = body;

        // =========================
        // VALIDAÇÕES
        // =========================

        if (!tipo) {
            return NextResponse.json(
                { erro: "O tipo do agendamento é obrigatório." },
                { status: 400 }
            );
        }

        if (!pacienteId) {
            return NextResponse.json(
                { erro: "O paciente é obrigatório." },
                { status: 400 }
            );
        }

        if (!unidadeDeOrigemId) {
            return NextResponse.json(
                { erro: "A unidade de origem é obrigatória." },
                { status: 400 }
            );
        }

        if (!dataDeEntrada) {
            return NextResponse.json(
                { erro: "A data de entrada é obrigatória." },
                { status: 400 }
            );
        }

        if (!prioridade) {
            return NextResponse.json(
                { erro: "A prioridade é obrigatória." },
                { status: 400 }
            );
        }

        // =========================
        // VERIFICAR PACIENTE
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
        // CRIAR AGENDAMENTO
        // =========================

        const agendamento = await prisma.agendamento.create({
            data: {

                tipo,

                paciente: {
                    connect: {
                        id: pacienteId,
                    },
                },

                unidadeDeOrigem: {
                    connect: {
                        id: Number(unidadeDeOrigemId),
                    },
                },

                dataDeEntrada: new Date(dataDeEntrada),

                // Médico solicitante
                medicoSolicitante: medicoSolicitanteId
                    ? {
                        connect: {
                            id: Number(medicoSolicitanteId),
                        },
                    }
                    : undefined,

                // Especialidade
                especialidade: especialidadeId
                    ? {
                        connect: {
                            id: Number(especialidadeId),
                        },
                    }
                    : undefined,

                especialidadeFilha: especialidadeFilhaId
                    ? {
                        connect: {
                            id: Number(especialidadeFilhaId),
                        },
                    }
                    : undefined,

                tipoDeConsulta:
                    tipoDeConsulta || null,

                // Procedimento
                procedimento: procedimentoId
                    ? {
                        connect: {
                            id: Number(procedimentoId),
                        },
                    }
                    : undefined,

                procedimentoFilho: procedimentoFilhoId
                    ? {
                        connect: {
                            id: Number(procedimentoFilhoId),
                        },
                    }
                    : undefined,

                lado:
                    lado || null,

                prioridade,

                // Retorno
                condicaoDeRetorno:
                    condicaoDeRetorno || null,

                dataDoRetorno:
                    dataDoRetorno
                        ? new Date(dataDoRetorno)
                        : null,

                // Local de atendimento
                localDeAtendimento:
                    localDeAtendimentoId
                        ? {
                            connect: {
                                id: Number(localDeAtendimentoId),
                            },
                        }
                        : undefined,

                // Prestador
                prestador:
                    prestadorId
                        ? {
                            connect: {
                                id: Number(prestadorId),
                            },
                        }
                        : undefined,

                // Remarcação
                encaminhamentoRemarcado:
                    encaminhamentoRemarcado ?? false,

                // Status
                status:
                    status || "EM_ESPERA",

                // Data do agendamento
                dataDoAgendamento:
                    dataDoAgendamento
                        ? new Date(dataDoAgendamento)
                        : null,

                ativo:
                    ativo ?? true,
            },

            include: {
                paciente: true,
                unidadeDeOrigem: true,

                localDeAtendimento: true,
                prestador: true,

                medicoSolicitante: true,

                especialidade: true,
                especialidadeFilha: true,

                procedimento: true,
                procedimentoFilho: true,
            },
        });

        return NextResponse.json(
            agendamento,
            { status: 201 }
        );

    } catch (erro) {

        console.error(
            "Erro ao criar agendamento:",
            erro
        );

        return NextResponse.json(
            {
                erro: "Erro ao criar agendamento."
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const pacienteId = searchParams.get("pacienteId");
        const unidadeDeOrigemId = searchParams.get("unidadeDeOrigemId");
        const especialidadeId = searchParams.get("especialidadeId");
        const procedimentoId = searchParams.get("procedimentoId");
        const status = searchParams.get("status");
        const ativo = searchParams.get("ativo");

        // Novos filtros para a agenda
        const data = searchParams.get("data");
        const localDeAtendimentoId =
            searchParams.get("localDeAtendimentoId");
        const prestadorId = searchParams.get("prestadorId");

        let inicio: Date | undefined;
        let fim: Date | undefined;

        if (data) {
            inicio = new Date(`${data}T00:00:00`);
            fim = new Date(`${data}T23:59:59`);
        }

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                ...(pacienteId && {
                    pacienteId,
                }),

                ...(unidadeDeOrigemId && {
                    unidadeDeOrigemId: Number(unidadeDeOrigemId),
                }),

                ...(especialidadeId && {
                    especialidadeId: Number(especialidadeId),
                }),

                ...(procedimentoId && {
                    procedimentoId: Number(procedimentoId),
                }),

                ...(status && {
                    status: status as any,
                }),

                ...(ativo !== null && {
                    ativo: ativo === "true",
                }),

                // Filtro da agenda por data
                ...(data && {
                    dataDoAgendamento: {
                        gte: inicio,
                        lte: fim,
                    },
                }),

                // Local onde será realizado
                ...(localDeAtendimentoId && {
                    localDeAtendimentoId:
                        Number(localDeAtendimentoId),
                }),

                // Prestador que realizará
                ...(prestadorId && {
                    prestadorId: Number(prestadorId),
                }),
            },

            include: {
                paciente: true,
                unidadeDeOrigem: true,
                medicoSolicitante: true,
                especialidade: true,
                especialidadeFilha: true,
                procedimento: true,
                procedimentoFilho: true,
                localDeAtendimento: true,
                prestador: true,
            },

            orderBy: {
                dataDoAgendamento: "asc",
            },
        });

        return NextResponse.json(agendamentos);

    } catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro);

        return NextResponse.json(
            { erro: "Erro ao buscar agendamentos." },
            { status: 500 }
        );
    }
}