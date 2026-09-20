import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const prestadorId = Number(id)

        if (isNaN(prestadorId)) {
            return NextResponse.json(
                { erro: "ID do prestador inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()

        const {
            nome,
            codigo,
            ativo,
            rede,
            telefone,
            email,
            observacoes,
            especialidades,
            procedimentos
        } = body

        if (!nome || !codigo) {
            return NextResponse.json(
                { erro: "Nome e código são obrigatórios" },
                { status: 400 }
            )
        }

        const prestadorExistente = await prisma.prestador.findUnique({
            where: {
                id: prestadorId
            }
        })

        if (!prestadorExistente) {
            return NextResponse.json(
                { erro: "Prestador não encontrado" },
                { status: 404 }
            )
        }

        const prestador = await prisma.$transaction(async (tx) => {

            // Remove as especialidades atuais
            await tx.prestadorEspecialidade.deleteMany({
                where: {
                    prestadorId
                }
            })

            // Remove os procedimentos atuais
            await tx.prestadorProcedimento.deleteMany({
                where: {
                    prestadorId
                }
            })

            // Atualiza o prestador
            return await tx.prestador.update({
                where: {
                    id: prestadorId
                },

                data: {
                    nome,
                    codigo,
                    ativo: ativo ?? true,
                    rede,
                    telefone: telefone || null,
                    email: email || null,
                    observacoes: observacoes || null,

                    especialidades: {
                        create: (especialidades ?? []).map(
                            (especialidadeId: number) => ({
                                especialidade: {
                                    connect: {
                                        id: especialidadeId
                                    }
                                }
                            })
                        )
                    },

                    procedimentos: {
                        create: (procedimentos ?? []).map(
                            (procedimentoId: number) => ({
                                procedimento: {
                                    connect: {
                                        id: procedimentoId
                                    }
                                }
                            })
                        )
                    }
                },

                include: {
                    especialidades: {
                        include: {
                            especialidade: true
                        }
                    },

                    procedimentos: {
                        include: {
                            procedimento: true
                        }
                    }
                }
            })
        })

        return NextResponse.json(prestador)

    } catch (error) {
        console.error("Erro ao atualizar prestador:", error)

        return NextResponse.json(
            { erro: "Erro ao atualizar prestador" },
            { status: 500 }
        )
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const prestadorId = Number(id)

        if (isNaN(prestadorId)) {
            return NextResponse.json(
                { erro: "ID do prestador inválido" },
                { status: 400 }
            )
        }

        const prestador = await prisma.prestador.findUnique({
            where: {
                id: prestadorId
            }
        })

        if (!prestador) {
            return NextResponse.json(
                { erro: "Prestador não encontrado" },
                { status: 404 }
            )
        }

        await prisma.prestador.delete({
            where: {
                id: prestadorId
            }
        })

        return NextResponse.json({
            mensagem: "Prestador excluído com sucesso"
        })

    } catch (error) {
        console.error("Erro ao excluir prestador:", error)

        return NextResponse.json(
            { erro: "Erro ao excluir prestador" },
            { status: 500 }
        )
    }
}