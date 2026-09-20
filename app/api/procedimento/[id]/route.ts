import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProcedimentoFilho } from "@/app/generated/prisma/client";


// PUT - Editar procedimento
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const procedimentoId = Number(id);

        if (isNaN(procedimentoId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            nome,
            codigo,
            filhas = [],
        } = body;

        if (!nome || !codigo) {
            return NextResponse.json(
                { erro: "Nome e código são obrigatórios." },
                { status: 400 }
            );
        }

        // Verifica se existe
        const procedimento =
            await prisma.procedimento.findUnique({
                where: {
                    id: procedimentoId,
                },
            });

        if (!procedimento) {
            return NextResponse.json(
                { erro: "Procedimento não encontrado." },
                { status: 404 }
            );
        }

        // Verifica se outro procedimento já usa o código
        const codigoExistente =
            await prisma.procedimento.findFirst({
                where: {
                    codigo,
                    NOT: {
                        id: procedimentoId,
                    },
                },
            });

        if (codigoExistente) {
            return NextResponse.json(
                { erro: "Já existe outro procedimento com esse código." },
                { status: 409 }
            );
        }

        // Atualiza procedimento e suas filhas
        const procedimentoAtualizado =
            await prisma.$transaction(async (tx) => {

                // Remove as filhas antigas
                await tx.procedimentoFilho.deleteMany({
                    where: {
                        procedimentoId,
                    },
                });

                // Atualiza e cria as novas filhas
                return await tx.procedimento.update({
                    where: {
                        id: procedimentoId,
                    },

                    data: {
                        nome,
                        codigo,

                        filhas: {
                            create: filhas.map((filha: ProcedimentoFilho) => ({
                                nome: filha.nome,
                            })),
                        },
                    },

                    include: {
                        filhas: true,
                    },
                });
            });

        return NextResponse.json(
            procedimentoAtualizado
        );

    } catch (error) {
        console.error(
            "Erro ao editar procedimento:",
            error
        );

        return NextResponse.json(
            { erro: "Erro interno ao editar procedimento." },
            { status: 500 }
        );
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const procedimentoId = Number(id);

        if (isNaN(procedimentoId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const procedimento = await prisma.procedimento.findUnique({
            where: {
                id: procedimentoId,
            },
        });

        if (!procedimento) {
            return NextResponse.json(
                { erro: "Procedimento não encontrado." },
                { status: 404 }
            );
        }

        await prisma.procedimento.delete({
            where: {
                id: procedimentoId,
            },
        });

        return NextResponse.json({
            mensagem: "Procedimento excluído com sucesso.",
        });

    } catch (error) {
        console.error(
            "Erro ao excluir procedimento:",
            error
        );

        return NextResponse.json(
            { erro: "Erro interno ao excluir procedimento." },
            { status: 500 }
        );
    }
}