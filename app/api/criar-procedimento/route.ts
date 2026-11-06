
import { NextResponse } from "next/server"
import { TipoProcedimento, Lateralidade, } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"

import { Prisma } from "@/generated/prisma/client";

export type ProcedimentoComMembros = Prisma.ProcedimentoGetPayload<{
    include: {
        membros: true;
    };
}>;

export async function GET() {
    try {
        const procedimentos = await prisma.procedimento.findMany({
            include: {
                membros: {
                    orderBy: {
                        id: "asc",
                    },
                },
            },
            orderBy: {
                nome: "asc",
            },
        })

        return NextResponse.json(procedimentos, { status: 200 })

    } catch (erro) {
        console.error("Erro ao buscar procedimentos:", erro)

        return NextResponse.json(
            { erro: "Não foi possível buscar os procedimentos." },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const corpo = await request.json()

        const { nome, codigo, tipo, membros } = corpo

        // Validação dos campos obrigatórios
        if (
            typeof nome !== "string" ||
            !nome.trim() ||
            typeof codigo !== "string" ||
            !codigo.trim()
        ) {
            return NextResponse.json(
                { erro: "Nome e código são obrigatórios." },
                { status: 400 }
            )
        }

        // Validação do tipo
        if (!Object.values(TipoProcedimento).includes(tipo)) {
            return NextResponse.json(
                { erro: "Tipo de procedimento inválido." },
                { status: 400 }
            )
        }

        // Validação dos membros
        if (tipo === TipoProcedimento.COM_MEMBROS) {
            if (!Array.isArray(membros) || membros.length === 0) {
                return NextResponse.json(
                    { erro: "Adicione pelo menos um membro ao procedimento." },
                    { status: 400 }
                )
            }

            const membrosValidos = membros.every((membro) =>
                typeof membro.nome === "string" &&
                membro.nome.trim() &&
                Object.values(Lateralidade).includes(membro.lateralidade)
            )

            if (!membrosValidos) {
                return NextResponse.json(
                    { erro: "Existem membros com dados inválidos." },
                    { status: 400 }
                )
            }
        } else if (membros && membros.length > 0) {
            return NextResponse.json(
                { erro: "Procedimentos comuns não podem possuir membros." },
                { status: 400 }
            )
        }

        // Cadastro do procedimento e seus membros
        const procedimento = await prisma.procedimento.create({
            data: {
                nome: nome.trim(),
                codigo: codigo.trim(),
                tipo,
                membros: {
                    create: tipo === TipoProcedimento.COM_MEMBROS
                        ? membros.map((membro: {
                            nome: string
                            lateralidade: Lateralidade
                        }) => ({
                            nome: membro.nome.trim(),
                            lateralidade: membro.lateralidade,
                        }))
                        : [],
                },
            },
            include: {
                membros: true,
            },
        })

        return NextResponse.json(procedimento, { status: 201 })

    } catch (erro) {
        console.error("Erro ao cadastrar procedimento:", erro)

        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "P2002"
        ) {
            return NextResponse.json(
                { erro: "Já existe um procedimento com esse nome ou código." },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { erro: "Não foi possível cadastrar o procedimento." },
            { status: 500 }
        )
    }
}
