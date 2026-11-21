
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const encaminhamentoId = Number(id);

        if (!Number.isInteger(encaminhamentoId) || encaminhamentoId <= 0) {
            return NextResponse.json(
                { erro: "ID do encaminhamento inválido." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            dataDeSaida,
            dataDeAgendamentoLocal,
            prestadorExecutanteId,
            localDeAtendimentoId,
            horarioDeAgendamento
        } = body;

        // Validação dos campos obrigatórios
        if (
            !dataDeAgendamentoLocal ||
            !prestadorExecutanteId ||
            !localDeAtendimentoId ||
            !horarioDeAgendamento
        ) {
            return NextResponse.json(
                { erro: "Preencha os dados obrigatórios do agendamento." },
                { status: 400 }
            );
        }

        // Verifica se o encaminhamento existe
        const encaminhamentoExistente = await prisma.encaminhamento.findUnique({
            where: { id: encaminhamentoId }
        });

        if (!encaminhamentoExistente) {
            return NextResponse.json(
                { erro: "Encaminhamento não encontrado." },
                { status: 404 }
            );
        }

        // Verifica o prestador executante
        const prestador = await prisma.prestador.findUnique({
            where: {
                id: Number(prestadorExecutanteId)
            }
        });

        if (!prestador || !prestador.ativo) {
            return NextResponse.json(
                { erro: "Prestador não encontrado ou inativo." },
                { status: 404 }
            );
        }

        // Verifica o local de atendimento
        const local = await prisma.local.findUnique({
            where: {
                id: Number(localDeAtendimentoId)
            }
        });

        if (!local || !local.ativo) {
            return NextResponse.json(
                { erro: "Local de atendimento não encontrado ou inativo." },
                { status: 404 }
            );
        }

        // Validação das datas
        const dataAgendamento = new Date(dataDeAgendamentoLocal);

        if (isNaN(dataAgendamento.getTime())) {
            return NextResponse.json(
                { erro: "Data de agendamento inválida." },
                { status: 400 }
            );
        }

        let dataSaida: Date | null = null;

        if (dataDeSaida) {
            dataSaida = new Date(dataDeSaida);

            if (isNaN(dataSaida.getTime())) {
                return NextResponse.json(
                    { erro: "Data de saída inválida." },
                    { status: 400 }
                );
            }
        }

        // Atualiza o encaminhamento
        const encaminhamentoAtualizado = await prisma.encaminhamento.update({
            where: {
                id: encaminhamentoId
            },
            data: {
                statusDeAgendamento: "AGENDADO",
                dataDeSaida: dataSaida,
                dataDeAgendamentoLocal: dataAgendamento,
                prestadorExecutanteId: prestador.id,
                localDeAtendimentoId: local.id,
                horarioDeAgendamento,
            },
            include: {
                paciente: true,
                unidadeDeOrigem: true,
                medicoSolicitante: true,
                especialidadeDoPrestador: true,
                especialidadeEncaminhada: true,
                procedimento: {
                    include: {
                        membros: true
                    }
                },
                membroProcedimento: true,
                prestadorExecutante: true,
                localDeAtendimento: true
            }
        });

        return NextResponse.json(encaminhamentoAtualizado, {
            status: 200
        });

    } catch (error) {
        console.error("Erro ao atualizar encaminhamento:", error);

        return NextResponse.json(
            { erro: "Erro interno ao atualizar encaminhamento." },
            { status: 500 }
        );
    }
}
