import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const especialidadeId = Number(id)

        const body = await request.json()

        const {
            nome,
            codigo,
            tipo,
            filhas = [],
        } = body

        const especialidade = await prisma.especialidade.findUnique({
            where: {
                id: especialidadeId,
            },
        })

        if (!especialidade) {
            return NextResponse.json(
                { erro: "Especialidade não encontrada." },
                { status: 404 }
            )
        }

        const resultado = await prisma.$transaction(async (tx) => {

            const atualizada = await tx.especialidade.update({
                where: {
                    id: especialidadeId,
                },
                data: {
                    nome,
                    codigo,
                    tipo,
                },
            })

            await tx.especialidadeFilha.deleteMany({
                where: {
                    especialidadeId,
                },
            })

            if (filhas.length > 0) {
                await tx.especialidadeFilha.createMany({
                    data: filhas.map((filha: string) => ({
                        nome: filha,
                        especialidadeId,
                    })),
                })
            }

            return atualizada
        })

        return NextResponse.json(resultado)

    } catch (error) {
        console.error("Erro ao atualizar especialidade:", error)

        return NextResponse.json(
            { erro: "Erro interno ao atualizar especialidade." },
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

        const especialidadeId = Number(id)

        if (isNaN(especialidadeId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            )
        }

        const especialidade = await prisma.especialidade.findUnique({
            where: {
                id: especialidadeId,
            },
        })

        if (!especialidade) {
            return NextResponse.json(
                { erro: "Especialidade não encontrada." },
                { status: 404 }
            )
        }

        await prisma.especialidade.delete({
            where: {
                id: especialidadeId,
            },
        })

        return NextResponse.json({
            mensagem: "Especialidade excluída com sucesso.",
        })

    } catch (error) {
        console.error("Erro ao excluir especialidade:", error)

        return NextResponse.json(
            { erro: "Erro interno ao excluir especialidade." },
            { status: 500 }
        )
    }
}