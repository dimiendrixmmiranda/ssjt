import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Editar local
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const localId = Number(id);

        if (isNaN(localId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            nome,
            tipo,
            rede,
            ativo,
            cidade,
            cep,
            uf,
            rua,
            numero,
            bairro,
            complemento,
            telefone1,
            telefone2,
            email,
        } = body;

        if (
            !nome ||
            !tipo ||
            !rede ||
            !cidade ||
            !cep ||
            !uf ||
            !rua ||
            !numero ||
            !bairro ||
            !telefone1
        ) {
            return NextResponse.json(
                {
                    erro: "Nome, tipo, cidade, CEP, UF, rua, número, bairro e telefone 1 são obrigatórios.",
                },
                { status: 400 }
            );
        }

        const local = await prisma.local.findUnique({
            where: {
                id: localId,
            },
        });

        if (!local) {
            return NextResponse.json(
                { erro: "Local não encontrado." },
                { status: 404 }
            );
        }

        const localAtualizado = await prisma.local.update({
            where: {
                id: localId,
            },
            data: {
                nome,
                tipo,
                rede,
                ativo,

                cidade,
                cep,
                uf,

                rua,
                numero,
                bairro,
                complemento: complemento || null,

                telefone1,
                telefone2: telefone2 || null,
                email: email || null,
            },
        });

        return NextResponse.json(
            localAtualizado
        );

    } catch (error) {
        console.error("Erro ao editar local:", error);

        return NextResponse.json(
            { erro: "Erro interno ao editar local." },
            { status: 500 }
        );
    }
}


// DELETE - Excluir local
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const localId = Number(id);

        if (isNaN(localId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const local = await prisma.local.findUnique({
            where: {
                id: localId,
            },
        });

        if (!local) {
            return NextResponse.json(
                { erro: "Local não encontrado." },
                { status: 404 }
            );
        }

        await prisma.local.delete({
            where: {
                id: localId,
            },
        });

        return NextResponse.json({
            mensagem: "Local excluído com sucesso.",
        });

    } catch (error) {
        console.error("Erro ao excluir local:", error);

        return NextResponse.json(
            { erro: "Erro interno ao excluir local." },
            { status: 500 }
        );
    }
}