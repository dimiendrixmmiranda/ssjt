import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Cadastrar médico
export async function POST(request: Request) {
    try {
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

        const medicoExistente = await prisma.medico.findFirst({
            where: {
                OR: [
                    { codigo },
                    { crm },
                ],
            },
        });

        if (medicoExistente) {
            return NextResponse.json(
                { erro: "Já existe um médico com esse código ou CRM." },
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

        const medico = await prisma.medico.create({
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
            medico,
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro ao cadastrar médico:", error);

        return NextResponse.json(
            { erro: "Erro interno ao cadastrar médico." },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        const medicos = await prisma.medico.findMany({
            where: {
                ativo: true,
            },
            include: {
                especialidade: true,
            },
            orderBy: {
                nome: "asc",
            },
        });

        return NextResponse.json(medicos);

    } catch (error) {
        console.error("Erro ao buscar médicos:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao buscar médicos.",
            },
            {
                status: 500,
            }
        );
    }
}