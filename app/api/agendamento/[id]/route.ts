import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const agendamento = await prisma.agendamento.update({
            where: {
                id
            },

            data: {
                ...(body.dataDoAgendamento !== undefined && {
                    dataDoAgendamento: body.dataDoAgendamento
                        ? new Date(body.dataDoAgendamento)
                        : null,
                }),

                ...(body.dataDeSaida !== undefined && {
                    dataDeSaida: body.dataDeSaida
                        ? new Date(body.dataDeSaida)
                        : null,
                }),

                ...(body.localDeAtendimentoId !== undefined && {
                    localDeAtendimentoId:
                        body.localDeAtendimentoId
                            ? Number(body.localDeAtendimentoId)
                            : null,
                }),

                ...(body.prestadorId !== undefined && {
                    prestadorId:
                        body.prestadorId
                            ? Number(body.prestadorId)
                            : null,
                }),

                ...(body.status !== undefined && {
                    status: body.status,
                }),
            },
        })
        return NextResponse.json(agendamento)
    } catch (erro) {
        console.error("Erro ao atualizar agendamento:", erro)
        return NextResponse.json(
            {
                erro: "Não foi possível atualizar o agendamento."
            },
            {
                status: 500
            }
        )
    }
}