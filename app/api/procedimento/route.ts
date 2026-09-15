import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProcedimentoFilho } from "@/app/generated/prisma/client";

// POST - Cadastrar procedimento
export async function POST(request: Request) {
    try {
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

        const procedimentoExistente =
            await prisma.procedimento.findUnique({
                where: {
                    codigo,
                },
            });

        if (procedimentoExistente) {
            return NextResponse.json(
                { erro: "Já existe um procedimento com esse código." },
                { status: 409 }
            );
        }

        const procedimento = await prisma.procedimento.create({
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

        return NextResponse.json(
            procedimento,
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro ao cadastrar procedimento:", error);

        return NextResponse.json(
            { erro: "Erro interno ao cadastrar procedimento." },
            { status: 500 }
        );
    }
}

// GET - Buscar procedimentos
export async function GET() {
    try {
        const procedimentos = await prisma.procedimento.findMany({
            where: {
                ativo: true,
            },
            include: {
                filhas: true,
            },
            orderBy: {
                nome: "asc",
            },
        });

        return NextResponse.json(procedimentos);

    } catch (error) {
        console.error("Erro ao buscar procedimentos:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao buscar procedimentos.",
            },
            {
                status: 500,
            }
        );
    }
}