import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Períodos permitidos
const PERIODOS_VALIDOS = ["MANHA", "TARDE", "NOITE"];

// Valida uma data no formato YYYY-MM-DD
function converterData(data: unknown): Date | null {
    if (typeof data !== "string") return null;

    const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(data);

    if (!formatoValido) return null;

    const dataConvertida = new Date(`${data}T00:00:00.000Z`);

    if (dataConvertida.toISOString().slice(0, 10) !== data) {
        return null;
    }

    return dataConvertida;
}

// GET - Consultar agendamentos
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const localIdParametro = searchParams.get("localId");
        const dataParametro = searchParams.get("data");
        const inicioParametro = searchParams.get("inicio");
        const fimParametro = searchParams.get("fim");

        // Validar o ID da unidade, caso informado
        let localId: number | undefined;

        if (localIdParametro !== null) {
            localId = Number(localIdParametro);

            if (!Number.isInteger(localId) || localId <= 0) {
                return NextResponse.json(
                    { mensagem: "ID da unidade inválido." },
                    { status: 400 }
                );
            }
        }

        // Não permitir misturar data específica com intervalo
        if (
            dataParametro &&
            (inicioParametro || fimParametro)
        ) {
            return NextResponse.json(
                {
                    mensagem:
                        "Informe uma data específica ou um intervalo de datas, não os dois.",
                },
                { status: 400 }
            );
        }

        // Validar data específica
        let dataFiltro: Date | undefined;

        if (dataParametro) {
            dataFiltro = converterData(dataParametro) ?? undefined;

            if (!dataFiltro) {
                return NextResponse.json(
                    { mensagem: "Data inválida. Utilize YYYY-MM-DD." },
                    { status: 400 }
                );
            }
        }

        // Validar intervalo
        let dataInicio: Date | undefined;
        let dataFim: Date | undefined;

        if (inicioParametro || fimParametro) {
            if (!inicioParametro || !fimParametro) {
                return NextResponse.json(
                    {
                        mensagem:
                            "Informe as duas datas: inicio e fim.",
                    },
                    { status: 400 }
                );
            }

            dataInicio = converterData(inicioParametro) ?? undefined;
            dataFim = converterData(fimParametro) ?? undefined;

            if (!dataInicio || !dataFim) {
                return NextResponse.json(
                    {
                        mensagem:
                            "Intervalo inválido. Utilize YYYY-MM-DD.",
                    },
                    { status: 400 }
                );
            }

            if (dataInicio > dataFim) {
                return NextResponse.json(
                    {
                        mensagem:
                            "A data inicial não pode ser posterior à data final.",
                    },
                    { status: 400 }
                );
            }
        }

        const agendamentos =
            await prisma.agendamentoDePrestador.findMany({
                where: {
                    ...(localId !== undefined && {
                        unidadeDeAtendimentoId: localId,
                    }),

                    ...(dataFiltro && {
                        data: dataFiltro,
                    }),

                    ...(dataInicio &&
                        dataFim && {
                        data: {
                            gte: dataInicio,
                            lte: dataFim,
                        },
                    }),
                },

                include: {
                    prestador: {
                        include: {
                            especialidades: {
                                include: {
                                    especialidade: true,
                                },
                            },
                            procedimentos: {
                                include: {
                                    procedimento: true,
                                },
                            },
                        },
                    },

                    unidadeDeAtendimento: true,
                },

                orderBy: [
                    { data: "asc" },
                    { periodo: "asc" },
                    { salaNumero: "asc" },
                ],
            });

        return NextResponse.json(agendamentos, { status: 200 });
    } catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro);

        return NextResponse.json(
            { mensagem: "Erro ao buscar os agendamentos." },
            { status: 500 }
        );
    }
}

// POST - Cadastrar agendamento
export async function POST(request: NextRequest) {
    try {
        const sessao = await auth();

        if (!sessao?.user?.id) {
            return Response.json(
                { mensagem: "Usuário não autenticado." },
                { status: 401 }
            );
        }

        const corpo = await request.json();

        const {
            data,
            prestadorId,
            unidadeDeAtendimentoId,
            periodo,
            salaNumero,
            observacoes,
        } = corpo;

        // 1. Validar campos obrigatórios
        if (
            !data ||
            prestadorId === undefined ||
            unidadeDeAtendimentoId === undefined ||
            !periodo ||
            salaNumero === undefined
        ) {
            return NextResponse.json(
                { mensagem: "Preencha todos os campos obrigatórios." },
                { status: 400 }
            );
        }

        // 2. Validar data
        const dataConvertida = converterData(data);

        if (!dataConvertida) {
            return NextResponse.json(
                {
                    mensagem:
                        "Data inválida. Utilize o formato YYYY-MM-DD.",
                },
                { status: 400 }
            );
        }

        // 3. Validar IDs e número da sala
        if (
            !Number.isInteger(prestadorId) ||
            prestadorId <= 0 ||
            !Number.isInteger(unidadeDeAtendimentoId) ||
            unidadeDeAtendimentoId <= 0 ||
            !Number.isInteger(salaNumero) ||
            salaNumero <= 0
        ) {
            return NextResponse.json(
                { mensagem: "Prestador, unidade ou sala inválidos." },
                { status: 400 }
            );
        }

        // 4. Validar período
        if (!PERIODOS_VALIDOS.includes(periodo)) {
            return NextResponse.json(
                { mensagem: "Período de atendimento inválido." },
                { status: 400 }
            );
        }

        // 5. Verificar se a unidade existe e está ativa
        const unidade = await prisma.local.findUnique({
            where: {
                id: unidadeDeAtendimentoId,
            },
            select: {
                id: true,
                nome: true,
                quantidadeDeSalas: true,
                ativo: true,
            },
        });

        if (!unidade || !unidade.ativo) {
            return NextResponse.json(
                { mensagem: "Unidade não encontrada ou inativa." },
                { status: 404 }
            );
        }

        // 6. Verificar se a sala existe naquela unidade
        if (salaNumero > unidade.quantidadeDeSalas) {
            return NextResponse.json(
                {
                    mensagem:
                        `Esta unidade possui apenas ${unidade.quantidadeDeSalas} salas.`,
                },
                { status: 400 }
            );
        }

        // 7. Verificar se o prestador existe e está ativo
        const prestador = await prisma.prestador.findUnique({
            where: {
                id: prestadorId,
            },
            select: {
                id: true,
                nome: true,
                ativo: true,
            },
        });

        if (!prestador || !prestador.ativo) {
            return NextResponse.json(
                { mensagem: "Prestador não encontrado ou inativo." },
                { status: 404 }
            );
        }

        // 8. Verificar se a sala já está ocupada
        const agendamentoExistente =
            await prisma.agendamentoDePrestador.findFirst({
                where: {
                    data: dataConvertida,
                    unidadeDeAtendimentoId,
                    salaNumero,
                    periodo,
                },
            });

        if (agendamentoExistente) {
            return NextResponse.json(
                {
                    mensagem:
                        "Esta sala já possui um agendamento nesta data e período.",
                },
                { status: 409 }
            );
        }

        // 9. Cadastrar agendamento
        const novoAgendamento =
            await prisma.agendamentoDePrestador.create({
                data: {
                    data: dataConvertida,
                    prestadorId,
                    unidadeDeAtendimentoId,
                    periodo,
                    salaNumero,
                    observacoes:
                        typeof observacoes === "string" &&
                            observacoes.trim() !== ""
                            ? observacoes.trim()
                            : null,
                    criadoPorId: sessao.user.id,
                },

                include: {
                    prestador: true,
                    unidadeDeAtendimento: true,
                    criadoPor: true,
                },
            });

        return NextResponse.json(
            {
                mensagem: "Agendamento cadastrado com sucesso.",
                agendamento: novoAgendamento,
            },
            { status: 201 }
        );
    } catch (erro) {
        console.error("Erro ao cadastrar agendamento:", erro);

        // 10. Tratar conflito de unicidade do banco
        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "P2002"
        ) {
            return NextResponse.json(
                {
                    mensagem:
                        "Esta sala já possui um agendamento nesta data e período.",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { mensagem: "Erro ao cadastrar o agendamento." },
            { status: 500 }
        );
    }
}