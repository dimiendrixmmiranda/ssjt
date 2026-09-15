import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            nome,
            codigo,
            tipo,
            filhas = [],
        } = body;
        if (!nome || !codigo || !tipo) {
            return NextResponse.json(
                {
                    erro: "Nome, código e tipo são obrigatórios.",
                },
                {
                    status: 400,
                }
            );
        }
        const especialidadeExistente = await prisma.especialidade.findUnique({
            where: {
                codigo,
            },
        });
        if (especialidadeExistente) {
            return NextResponse.json(
                {
                    erro: "Já existe uma especialidade com esse código.",
                },
                {
                    status: 409,
                }
            );
        }
        const especialidade = await prisma.especialidade.create({
            data: {
                nome,
                codigo,
                tipo,
                filhas: {
                    create: filhas.map((filha: string) => ({
                        nome: filha,
                    })),
                },
            },
            include: {
                filhas: true,
            },
        });
        return NextResponse.json(especialidade, {
            status: 201,
        });
    } catch (error) {
        console.error("Erro ao cadastrar especialidade:", error);
        return NextResponse.json(
            {
                erro: "Erro interno ao cadastrar especialidade.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET() {
    try {
        const especialidades = await prisma.especialidade.findMany({
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
        return NextResponse.json(especialidades);
    } catch (error) {
        console.error("Erro ao buscar especialidades:", error);
        return NextResponse.json(
            {
                erro: "Erro interno ao buscar especialidades.",
            },
            {
                status: 500,
            }
        );
    }
}