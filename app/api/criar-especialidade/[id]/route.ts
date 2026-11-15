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

        const dados = await request.json()

        const { nome, codigo, categoria, tiposDeCirurgia } = dados

        // Validação dos campos obrigatórios
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

        // Validação do código
        if (!/^\d{3}$/.test(codigo.trim())) {
            return NextResponse.json(
                { erro: "O código deve conter exatamente 3 dígitos." },
                { status: 400 }
            )
        }

        // Validação das categorias
        const categoriasValidas = Object.values(CategoriaEspecialidade)

        if (
            !categoria.every(
                (item: string) =>
                    categoriasValidas.includes(item as CategoriaEspecialidade)
            )
        ) {
            return NextResponse.json(
                { erro: "Categoria inválida." },
                { status: 400 }
            )
        }

        // Validação dos tipos de cirurgia
        const cirurgiasRecebidas: unknown = tiposDeCirurgia ?? []

        if (
            !Array.isArray(cirurgiasRecebidas) ||
            cirurgiasRecebidas.some(
                (cirurgia: unknown) =>
                    typeof cirurgia !== "string" || !cirurgia.trim()
            )
        ) {
            return NextResponse.json(
                { erro: "Informe uma lista válida de tipos de cirurgia." },
                { status: 400 }
            )
        }

        const cirurgias = (cirurgiasRecebidas as string[]).map(
            cirurgia => cirurgia.trim()
        )

        // Impede cirurgias duplicadas
        const cirurgiasNormalizadas = cirurgias.map(
            cirurgia => cirurgia.toLowerCase()
        )

        if (new Set(cirurgiasNormalizadas).size !== cirurgias.length) {
            return NextResponse.json(
                { erro: "Existem tipos de cirurgia duplicados na lista." },
                { status: 400 }
            )
        }

        // Atualiza a especialidade e sincroniza as cirurgias
        const especialidade = await prisma.$transaction(async (tx) => {

            const especialidadeAtualizada = await tx.especialidade.update({
                where: {
                    id: idNumerico,
                },
                data: {
                    nome: nome.trim(),
                    codigo: codigo.trim(),
                    categoria,
                },
            })

            // Remove cirurgias que não estão mais na lista
            await tx.tipoDeCirurgia.deleteMany({
                where: {
                    especialidadeId: idNumerico,
                    nome: {
                        notIn: cirurgias,
                    },
                },
            })

            // Cadastra as novas cirurgias sem duplicar as existentes
            await tx.tipoDeCirurgia.createMany({
                data: cirurgias.map(nome => ({
                    nome,
                    especialidadeId: idNumerico,
                })),
                skipDuplicates: true,
            })

            return tx.especialidade.findUnique({
                where: {
                    id: idNumerico,
                },
                include: {
                    tiposDeCirurgia: true,
                },
            })
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