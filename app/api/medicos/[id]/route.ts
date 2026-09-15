import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Editar médico
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const medicoId = Number(id);

        if (isNaN(medicoId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            nome,
            codigo,
            crm,
            especialidadeId,
        } = body;

        if (!nome || !codigo || !crm || !especialidadeId) {
            return NextResponse.json(
                { erro: "Nome, código, CRM e especialidade são obrigatórios." },
                { status: 400 }
            );
        }

        const medico = await prisma.medico.findUnique({
            where: {
                id: medicoId,
            },
        });

        if (!medico) {
            return NextResponse.json(
                { erro: "Médico não encontrado." },
                { status: 404 }
            );
        }

        const outroMedico = await prisma.medico.findFirst({
            where: {
                OR: [
                    { codigo },
                    { crm },
                ],
                NOT: {
                    id: medicoId,
                },
            },
        });

        if (outroMedico) {
            return NextResponse.json(
                { erro: "Outro médico já utiliza esse código ou CRM." },
                { status: 409 }
            );
        }

        const especialidade = await prisma.especialidade.findUnique({
            where: {
                id: Number(especialidadeId),
            },
        });

        if (!especialidade) {
            return NextResponse.json(
                { erro: "Especialidade não encontrada." },
                { status: 404 }
            );
        }

        const medicoAtualizado = await prisma.medico.update({
            where: {
                id: medicoId,
            },
            data: {
                nome,
                codigo,
                crm,
                especialidadeId: Number(especialidadeId),
            },
            include: {
                especialidade: true,
            },
        });

        return NextResponse.json(
            medicoAtualizado
        );

    } catch (error) {
        console.error("Erro ao editar médico:", error);

        return NextResponse.json(
            { erro: "Erro interno ao editar médico." },
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

        const medicoId = Number(id);

        if (isNaN(medicoId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const medico = await prisma.medico.findUnique({
            where: {
                id: medicoId,
            },
        });

        if (!medico) {
            return NextResponse.json(
                { erro: "Médico não encontrado." },
                { status: 404 }
            );
        }

        await prisma.medico.delete({
            where: {
                id: medicoId,
            },
        });

        return NextResponse.json({
            mensagem: "Médico excluído com sucesso.",
        });

    } catch (error) {
        console.error("Erro ao excluir médico:", error);

        return NextResponse.json(
            { erro: "Erro interno ao excluir médico." },
            { status: 500 }
        );
    }
}