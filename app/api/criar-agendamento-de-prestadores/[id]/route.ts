import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PeriodoDeAtendimento } from "@/generated/prisma/enums";
import { auth } from "@/auth";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params;
        const agendamentoId = Number(id);

        const sessao = await auth();

        if (!sessao?.user?.id) {
            return Response.json(
                { mensagem: "Usuário não autenticado." },
                { status: 401 }
            );
        }

        // Validação do ID
        if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
            return NextResponse.json(
                { erro: "ID do agendamento inválido." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const { data, periodo, salaNumero } = body;

        // Validação dos campos obrigatórios
        if (!data || !periodo || salaNumero === undefined || salaNumero === null) {
            return NextResponse.json(
                { erro: "Informe a data, o período e a sala do atendimento." },
                { status: 400 }
            );
        }

        // Validação da data
        if (
            typeof data !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data)
        ) {
            return NextResponse.json(
                { erro: "Data inválida." },
                { status: 400 }
            );
        }

        const dataAgendamento = new Date(`${data}T00:00:00.000Z`);

        if (
            Number.isNaN(dataAgendamento.getTime()) ||
            dataAgendamento.toISOString().slice(0, 10) !== data
        ) {
            return NextResponse.json(
                { erro: "Informe uma data válida." },
                { status: 400 }
            );
        }

        // Validação do período
        if (
            !Object.values(PeriodoDeAtendimento).includes(periodo)
        ) {
            return NextResponse.json(
                { erro: "Período de atendimento inválido." },
                { status: 400 }
            );
        }

        // Validação da sala
        if (
            !Number.isInteger(salaNumero) ||
            salaNumero <= 0
        ) {
            return NextResponse.json(
                { erro: "Número da sala inválido." },
                { status: 400 }
            );
        }

        // Busca o agendamento atual
        const agendamentoAtual = await prisma.agendamentoDePrestador.findUnique({
            where: {
                id: agendamentoId,
            },
        });

        if (!agendamentoAtual) {
            return NextResponse.json(
                { erro: "Agendamento não encontrado." },
                { status: 404 }
            );
        }

        // Busca a unidade de atendimento
        const local = await prisma.local.findUnique({
            where: {
                id: agendamentoAtual.unidadeDeAtendimentoId,
            },
        });

        if (!local) {
            return NextResponse.json(
                { erro: "Unidade de atendimento não encontrada." },
                { status: 404 }
            );
        }

        // Verifica se a sala pertence à unidade
        if (salaNumero > local.quantidadeDeSalas) {
            return NextResponse.json(
                { erro: "A sala informada não existe nesta unidade de atendimento." },
                { status: 400 }
            );
        }

        // Verifica se já existe outro agendamento na mesma sala,
        // unidade, data e período.
        const conflito = await prisma.agendamentoDePrestador.findFirst({
            where: {
                id: {
                    not: agendamentoId,
                },
                data: dataAgendamento,
                unidadeDeAtendimentoId: agendamentoAtual.unidadeDeAtendimentoId,
                periodo,
                salaNumero,
            },
        });

        if (conflito) {
            return NextResponse.json(
                {
                    erro: "Esta sala já está ocupada na data e no período selecionados.",
                },
                { status: 409 }
            );
        }

        // Atualiza o agendamento
        const agendamento = await prisma.agendamentoDePrestador.update({
            where: {
                id: agendamentoId,
            },
            data: {
                data: dataAgendamento,
                periodo,
                salaNumero,
                criadoPorId: sessao.user.id,
            },
            include: {
                prestador: true,
                unidadeDeAtendimento: true,
                criadoPor: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(
            {
                mensagem: "Agendamento atualizado com sucesso.",
                agendamento,
            },
            { status: 200 }
        );

    } catch (erro: unknown) {
        console.error("Erro ao atualizar agendamento:", erro);

        const codigo = (erro as { code?: string })?.code;

        if (codigo === "P2025") {
            return NextResponse.json(
                { erro: "Agendamento não encontrado." },
                { status: 404 }
            );
        }

        if (codigo === "P2002") {
            return NextResponse.json(
                {
                    erro: "Esta sala já está ocupada na data e no período selecionados.",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { erro: "Erro interno ao atualizar o agendamento." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: Params
) {
    try {
        const { id } = await params
        const agendamentoId = Number(id)

        const sessao = await auth()

        if (!sessao?.user?.id) {
            return NextResponse.json(
                { erro: "Usuário não autenticado." },
                { status: 401 }
            )
        }

        // Validação do ID
        if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
            return NextResponse.json(
                { erro: "ID do agendamento inválido." },
                { status: 400 }
            )
        }

        // Verifica se o agendamento existe
        const agendamento = await prisma.agendamentoDePrestador.findUnique({
            where: {
                id: agendamentoId,
            },
        })

        if (!agendamento) {
            return NextResponse.json(
                { erro: "Agendamento não encontrado." },
                { status: 404 }
            )
        }

        // Exclui o agendamento
        await prisma.agendamentoDePrestador.delete({
            where: {
                id: agendamentoId,
            },
        })

        return NextResponse.json(
            { mensagem: "Agendamento excluído com sucesso." },
            { status: 200 }
        )

    } catch (erro: unknown) {
        console.error("Erro ao excluir agendamento:", erro)

        const codigo = (erro as { code?: string })?.code

        if (codigo === "P2025") {
            return NextResponse.json(
                { erro: "Agendamento não encontrado." },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { erro: "Erro interno ao excluir o agendamento." },
            { status: 500 }
        )
    }
}