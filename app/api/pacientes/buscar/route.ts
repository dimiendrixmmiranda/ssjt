import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function converterDataBrasileira(valor: string) {
    const numeros = valor.replace(/\D/g, "")

    let dia: number
    let mes: number
    let ano: number

    if (numeros.length === 8) {
        dia = Number(numeros.substring(0, 2))
        mes = Number(numeros.substring(2, 4))
        ano = Number(numeros.substring(4, 8))
    } else {
        throw new Error("Data inválida.")
    }

    const data = new Date(
        Date.UTC(
            ano,
            mes - 1,
            dia
        )
    )

    if (
        data.getUTCFullYear() !== ano ||
        data.getUTCMonth() !== mes - 1 ||
        data.getUTCDate() !== dia
    ) {
        throw new Error("Data inválida.")
    }

    return data
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const tipo = searchParams.get("tipo")
        const valor = searchParams.get("valor")?.trim()

        if (!tipo || !valor) {
            return NextResponse.json(
                {
                    erro: "Informe o tipo e o valor da busca."
                },
                { status: 400 }
            )
        }

        let pacientes

        switch (tipo) {
            case "CPF":
                pacientes = await prisma.paciente.findMany({
                    where: {
                        cpf: valor.replace(/\D/g, "")
                    },
                    orderBy: {
                        nome: "asc"
                    }
                })
                break

            case "CARTAO_SUS":
                pacientes = await prisma.paciente.findMany({
                    where: {
                        cartaoSus: valor.replace(/\D/g, "")
                    },
                    orderBy: {
                        nome: "asc"
                    }
                })
                break

            case "NOME":
                pacientes = await prisma.paciente.findMany({
                    where: {
                        OR: [
                            {
                                nome: {
                                    contains: valor,
                                    mode: "insensitive"
                                }
                            },
                            {
                                nomeSocial: {
                                    contains: valor,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    },
                    orderBy: {
                        nome: "asc"
                    },
                    take: 50
                })
                break

            case "DATA_NASCIMENTO": {
                const data = converterDataBrasileira(valor)

                const inicio = new Date(data)
                inicio.setUTCHours(0, 0, 0, 0)

                const fim = new Date(data)
                fim.setUTCHours(23, 59, 59, 999)

                pacientes = await prisma.paciente.findMany({
                    where: {
                        dataDeNascimento: {
                            gte: inicio,
                            lte: fim
                        }
                    },
                    orderBy: {
                        nome: "asc"
                    }
                })

                break
            }

            default:
                return NextResponse.json(
                    {
                        erro: "Tipo de busca inválido."
                    },
                    { status: 400 }
                )
        }

        return NextResponse.json(pacientes)

    } catch (error) {
        console.error(
            "Erro ao buscar pacientes:",
            error
        )

        return NextResponse.json(
            {
                erro: "Erro interno ao buscar pacientes."
            },
            { status: 500 }
        )
    }
}