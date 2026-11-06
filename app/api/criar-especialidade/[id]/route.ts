import { NextResponse } from "next/server"
import { CategoriaEspecialidade } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma";

type Contexto = {
    params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Contexto) {
    try {
        const { id } = await params
        const idNumerico = Number(id)

        if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
            return NextResponse.json(
                { erro: "ID da especialidade inválido." },
                { status: 400 }
            )
        }

        const { nome, codigo, categoria } = await request.json()

        if (
            typeof nome !== "string" ||
            !nome.trim() ||
            typeof codigo !== "string" ||
            !codigo.trim() ||
            !Array.isArray(categoria) ||
            categoria.length === 0
        ) {
            return NextResponse.json(
                { erro: "Preencha todos os campos obrigatórios." },
                { status: 400 }
            )
        }

        if (!/^\d{3}$/.test(codigo.trim())) {
            return NextResponse.json(
                { erro: "O código deve conter exatamente 3 dígitos." },
                { status: 400 }
            )
        }

        const categoriasValidas = Object.values(CategoriaEspecialidade)

        if (!categoria.every((item: string) => categoriasValidas.includes(item as CategoriaEspecialidade))) {
            return NextResponse.json(
                { erro: "Categoria inválida." },
                { status: 400 }
            )
        }

        const especialidade = await prisma.especialidade.update({
            where: { id: idNumerico },
            data: {
                nome: nome.trim(),
                codigo: codigo.trim(),
                categoria,
            },
        })

        return NextResponse.json(especialidade)

    } catch (erro) {
        console.error("Erro ao atualizar especialidade:", erro)

        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "P2025"
        ) {
            return NextResponse.json(
                { erro: "Especialidade não encontrada." },
                { status: 404 }
            )
        }

        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "P2002"
        ) {
            return NextResponse.json(
                { erro: "Já existe uma especialidade com esse nome ou código." },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { erro: "Erro interno ao atualizar especialidade." },
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
        const idEspecialidade = Number(id)

        if (!Number.isInteger(idEspecialidade) || idEspecialidade <= 0) {
            return NextResponse.json(
                { erro: "ID da especialidade inválido." },
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

        const especialidade = await prisma.especialidade.update({
            where: {
                id: idEspecialidade,
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

        return NextResponse.json(especialidade, { status: 200 })

    } catch (erro) {
        console.error("Erro ao alterar status da especialidade:", erro)

        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "P2025"
        ) {
            return NextResponse.json(
                { erro: "Especialidade não encontrada." },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { erro: "Erro interno ao alterar status da especialidade." },
            { status: 500 }
        )
    }
}