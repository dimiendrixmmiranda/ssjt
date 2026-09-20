import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const prestadores = await prisma.prestador.findMany({
            orderBy: {
                nome: "asc"
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

        return NextResponse.json(prestadores)

    } catch (error) {
        console.error("Erro ao buscar prestadores:", error)

        return NextResponse.json(
            { erro: "Erro ao buscar prestadores" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
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

        const prestador = await prisma.prestador.create({
            data: {
                nome,
                codigo,
                ativo: ativo ?? true,
                rede,
                telefone: telefone || null,
                email: email || null,
                observacoes: observacoes || null,

                especialidades: {
                    create: (especialidades ?? []).map((especialidadeId: number) => ({
                        especialidade: {
                            connect: {
                                id: especialidadeId
                            }
                        }
                    }))
                },

                procedimentos: {
                    create: (procedimentos ?? []).map((procedimentoId: number) => ({
                        procedimento: {
                            connect: {
                                id: procedimentoId
                            }
                        }
                    }))
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

        return NextResponse.json(prestador, { status: 201 })

    } catch (error) {
        console.error("Erro ao cadastrar prestador:", error)

        return NextResponse.json(
            { erro: "Erro ao cadastrar prestador" },
            { status: 500 }
        )
    }
}