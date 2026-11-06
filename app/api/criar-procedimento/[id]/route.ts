
import { NextResponse } from "next/server"
import { TipoProcedimento, Lateralidade, } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"

type Contexto = {
    params: Promise<{ id: string }>
}

export async function PATCH(
    request: Request,
    { params }: Contexto
) {
    try {
        const { id } = await params
        const idProcedimento = Number(id)

        if (!Number.isInteger(idProcedimento) || idProcedimento <= 0) {
            return NextResponse.json(
                { erro: "ID do procedimento inválido." },
                { status: 400 }
            )
        }

        const corpo = await request.json()
        const { nome, codigo, tipo, membros } = corpo

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

        if (!Object.values(TipoProcedimento).includes(tipo)) {
            return NextResponse.json(
                { erro: "Tipo de procedimento inválido." },
                { status: 400 }
            )
        }

        if (!Array.isArray(membros)) {
            return NextResponse.json(
                { erro: "A lista de membros é inválida." },
                { status: 400 }
            )
        }

        if (tipo === TipoProcedimento.COM_MEMBROS && membros.length === 0) {
            return NextResponse.json(
                { erro: "Adicione pelo menos um membro ao procedimento." },
                { status: 400 }
            )
        }

        if (tipo === TipoProcedimento.COMUM && membros.length > 0) {
            return NextResponse.json(
                { erro: "Procedimentos comuns não podem possuir membros." },
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

        const procedimento = await prisma.procedimento.update({
            where: {
                id: idProcedimento,
            },
            data: {
                nome: nome.trim(),
                codigo: codigo.trim(),
                tipo,
                membros: {
                    deleteMany: {},
                    create: membros.map((membro: {
                        nome: string
                        lateralidade: Lateralidade
                    }) => ({
                        nome: membro.nome.trim(),
                        lateralidade: membro.lateralidade,
                    })),
                },
            },
            include: {
                membros: true,
            },
        })

        return NextResponse.json(procedimento, { status: 200 })

    } catch (erro) {
        console.error("Erro ao atualizar procedimento:", erro)

        if (typeof erro === "object" && erro !== null && "code" in erro) {
            if (erro.code === "P2025") {
                return NextResponse.json(
                    { erro: "Procedimento não encontrado." },
                    { status: 404 }
                )
            }

            if (erro.code === "P2002") {
                return NextResponse.json(
                    { erro: "Já existe um procedimento com esse nome ou código." },
                    { status: 409 }
                )
            }
        }

        return NextResponse.json(
            { erro: "Não foi possível atualizar o procedimento." },
            { status: 500 }
        )
    }
}



export async function PUT(
    request: Request,
    { params }: Contexto
) {
    try {
        const { id } = await params
        const idProcedimento = Number(id)

        if (!Number.isInteger(idProcedimento) || idProcedimento <= 0) {
            return NextResponse.json(
                { erro: "ID do procedimento inválido." },
                { status: 400 }
            )
        }

        const corpo = await request.json()
        const { ativo } = corpo

        if (typeof ativo !== "boolean") {
            return NextResponse.json(
                { erro: "O campo ativo deve ser verdadeiro ou falso." },
                { status: 400 }
            )
        }

        const procedimento = await prisma.procedimento.update({
            where: {
                id: idProcedimento,
            },
            data: {
                ativo,
            },
            select: {
                id: true,
                nome: true,
                ativo: true,
            },
        })

        return NextResponse.json(procedimento, { status: 200 })

    } catch (erro) {
        console.error("Erro ao alterar status do procedimento:", erro)

        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "P2025"
        ) {
            return NextResponse.json(
                { erro: "Procedimento não encontrado." },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { erro: "Não foi possível alterar o status do procedimento." },
            { status: 500 }
        )
    }
}
