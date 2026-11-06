import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { CategoriaEspecialidade } from "@/generated/prisma/client"

export async function GET() {
    try {
        const especialidades = await prisma.especialidade.findMany({
            orderBy: {
                nome: "asc",
            },
        })

        return NextResponse.json(especialidades)

    } catch (erro) {
        console.error("Erro ao buscar especialidades:", erro)

        return NextResponse.json(
            { erro: "Não foi possível buscar as especialidades." },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json()

        const { nome, codigo, categoria } = dados

        // Validação dos campos
        if (!nome?.trim() || !codigo?.trim() || !Array.isArray(categoria)) {
            return NextResponse.json(
                { erro: "Preencha todos os campos obrigatórios." },
                { status: 400 }
            )
        }

        // Validação do código
        if (!/^\d{3}$/.test(codigo)) {
            return NextResponse.json(
                { erro: "O código deve conter exatamente 3 dígitos." },
                { status: 400 }
            )
        }

        // Validação das categorias
        const categoriasValidas = Object.values(CategoriaEspecialidade)

        if (
            categoria.length === 0 ||
            categoria.some(
                (item: string) => !categoriasValidas.includes(item as CategoriaEspecialidade)
            )
        ) {
            return NextResponse.json(
                { erro: "Selecione pelo menos uma categoria válida." },
                { status: 400 }
            )
        }

        // Verifica se o nome já existe
        const nomeExistente = await prisma.especialidade.findUnique({
            where: {
                nome: nome.trim(),
            },
        })

        if (nomeExistente) {
            return NextResponse.json(
                { erro: "Essa especialidade já está cadastrada." },
                { status: 409 }
            )
        }

        // Verifica se o código já existe
        const codigoExistente = await prisma.especialidade.findUnique({
            where: {
                codigo: codigo.trim(),
            },
        })

        if (codigoExistente) {
            return NextResponse.json(
                { erro: "Esse código já está sendo utilizado." },
                { status: 409 }
            )
        }

        const especialidade = await prisma.especialidade.create({
            data: {
                nome: nome.trim(),
                codigo: codigo.trim(),
                categoria,
            },
        })

        return NextResponse.json(especialidade, { status: 201 })

    } catch (erro) {
        console.error("Erro ao cadastrar especialidade:", erro)

        return NextResponse.json(
            { erro: "Não foi possível cadastrar a especialidade." },
            { status: 500 }
        )
    }
}