import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        console.log("BODY RECEBIDO:", body)

        if (!body.nome?.trim()) {
            return NextResponse.json(
                { erro: "Informe o nome do local." },
                { status: 400 }
            )
        }

        if (!body.tipoDoLocal) {
            return NextResponse.json(
                { erro: "Informe o tipo do local." },
                { status: 400 }
            )
        }

        if (!body.cidade?.trim()) {
            return NextResponse.json(
                { erro: "Informe a cidade." },
                { status: 400 }
            )
        }

        if (!body.status) {
            return NextResponse.json(
                { erro: "Informe o status do local." },
                { status: 400 }
            )
        }

        // CORRETO: mesmo nome usado pelo frontend
        if (
            !Array.isArray(body.tiposDeAtendimento) ||
            body.tiposDeAtendimento.length === 0
        ) {
            return NextResponse.json(
                {
                    erro: "Adicione pelo menos um tipo de atendimento."
                },
                { status: 400 }
            )
        }

        const local = await prisma.local.create({
            data: {
                nome: body.nome.trim(),
                tipoDoLocal: body.tipoDoLocal,
                status: body.status,
                cidade: body.cidade.trim(),

                cep: body.cep || null,
                rua: body.rua || null,
                numero: body.numero || null,
                bairro: body.bairro || null,
                complemento: body.complemento || null,

                telefone1: body.telefone1 || null,
                telefone2: body.telefone2 || null,
                email: body.email || null,
                descricao: body.descricao || null,

                tiposDeAtendimento: {
                    create: body.tiposDeAtendimento.map(
                        (tipoAtendimentoId: string) => ({
                            tipoAtendimento: {
                                connect: {
                                    id: tipoAtendimentoId
                                }
                            }
                        })
                    )
                }
            },

            include: {
                tiposDeAtendimento: {
                    include: {
                        tipoAtendimento: true
                    }
                }
            }
        })

        return NextResponse.json(
            local,
            { status: 201 }
        )

    } catch (error) {
        console.error(
            "ERRO AO CADASTRAR LOCAL:",
            error
        )

        return NextResponse.json(
            {
                erro:
                    error instanceof Error
                        ? error.message
                        : "Erro interno ao cadastrar local."
            },
            { status: 500 }
        )
    }
}