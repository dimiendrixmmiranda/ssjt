import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            nome,
            categoria,
            ativo,
            codigo,
            descricao,
        } = body

        if (!nome || !categoria || !codigo) {
            return NextResponse.json(
                {
                    erro: "Preencha todos os campos obrigatórios.",
                },
                { status: 400 }
            )
        }

        const codigoNormalizado = codigo
            .trim()
            .toUpperCase()

        const tipoExistente =
            await prisma.tipoAtendimento.findUnique({
                where: {
                    codigo: codigoNormalizado,
                },
            })

        if (tipoExistente) {
            return NextResponse.json(
                {
                    erro: "Já existe um tipo de atendimento com este código.",
                },
                { status: 409 }
            )
        }

        const novoTipoAtendimento =
            await prisma.tipoAtendimento.create({
                data: {
                    nome: nome.trim(),
                    categoria,
                    ativo: ativo ?? true,
                    codigo: codigoNormalizado,
                    descricao: descricao?.trim() || null,
                },
            })

        return NextResponse.json(
            {
                mensagem:
                    "Tipo de atendimento criado com sucesso.",
                tipoAtendimento: novoTipoAtendimento,
            },
            { status: 201 }
        )

    } catch (error) {
        console.error(
            "Erro ao criar tipo de atendimento:",
            error
        )

        return NextResponse.json(
            {
                erro: "Erro interno ao criar tipo de atendimento.",
            },
            { status: 500 }
        )
    }
}
export async function GET() {
    try {
        const tiposAtendimento = await prisma.tipoAtendimento.findMany({
            orderBy: [
                {
                    categoria: "asc",
                },
                {
                    nome: "asc",
                },
            ],
        });

        return NextResponse.json(tiposAtendimento, {
            status: 200,
        });

    } catch (error) {
        console.error(
            "Erro ao buscar tipos de atendimento:",
            error
        );

        return NextResponse.json(
            {
                erro: "Erro interno ao buscar tipos de atendimento.",
            },
            { status: 500 }
        );
    }
}