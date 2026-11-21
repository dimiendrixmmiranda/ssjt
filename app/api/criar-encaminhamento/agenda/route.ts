
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {

    try {

        const sessao = await auth()

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)

        const data = searchParams.get("data")
        const prestadorId = Number(searchParams.get("prestadorId"))
        const encaminhamentoId = searchParams.get("encaminhamentoId")

        // Validação dos parâmetros
        if (
            !data ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
            !Number.isInteger(prestadorId) ||
            prestadorId <= 0
        ) {
            return NextResponse.json(
                { erro: "Parâmetros inválidos." },
                { status: 400 }
            )
        }

        // Valida se a data realmente existe
        const dataSelecionada = new Date(`${data}T00:00:00.000Z`)

        if (
            Number.isNaN(dataSelecionada.getTime()) ||
            dataSelecionada.toISOString().slice(0, 10) !== data
        ) {
            return NextResponse.json(
                { erro: "Data inválida." },
                { status: 400 }
            )
        }

        // Consulta os encaminhamentos agendados
        const agendamentos = await prisma.encaminhamento.findMany({

            where: {
                prestadorExecutanteId: prestadorId,

                dataDeAgendamentoLocal: dataSelecionada,

                statusDeAgendamento: "AGENDADO",

                ...(encaminhamentoId && {
                    id: {
                        not: Number(encaminhamentoId)
                    }
                })
            },

            select: {
                id: true,
                horarioDeAgendamento: true,

                paciente: {
                    select: {
                        nomeDoPaciente: true
                    }
                }
            },

            orderBy: {
                horarioDeAgendamento: "asc"
            }

        })

        return NextResponse.json(agendamentos)

    } catch (erro) {

        console.error(
            "Erro ao buscar agenda do prestador:",
            erro
        )

        return NextResponse.json(
            { erro: "Erro interno ao buscar a agenda." },
            { status: 500 }
        )

    }

}
