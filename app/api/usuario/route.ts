import { Perfil } from "@/app/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// POST - Cadastrar usuário
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const {
            nome,
            email,
            senha,
            perfil,
            unidadeDeOrigemId,
            dataDeNascimento
        } = body

        if (!nome || !email || !senha || !perfil) {
            return NextResponse.json(
                {
                    erro: "Nome, email, senha e perfil são obrigatórios.",
                },
                { status: 400 }
            )
        }

        const emailNormalizado = email.trim().toLowerCase()

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado,
            },
        })

        if (usuarioExistente) {
            return NextResponse.json(
                {
                    erro: "Já existe um usuário com esse email.",
                },
                { status: 409 }
            )
        }

        if (!Object.values(Perfil).includes(perfil)) {
            return NextResponse.json(
                {
                    erro: "Perfil inválido.",
                },
                { status: 400 }
            )
        }

        if (unidadeDeOrigemId) {
            const local = await prisma.local.findUnique({
                where: {
                    id: Number(unidadeDeOrigemId),
                },
            })

            if (!local) {
                return NextResponse.json(
                    {
                        erro: "Unidade de origem não encontrada.",
                    },
                    { status: 404 }
                )
            }
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const usuario = await prisma.usuario.create({
            data: {
                nome: nome.trim(),
                email: emailNormalizado,
                senha: senhaCriptografada,
                perfil,
                unidadeDeOrigemId: unidadeDeOrigemId
                    ? Number(unidadeDeOrigemId)
                    : null,
                dataDeNascimento: dataDeNascimento
                    ? new Date(dataDeNascimento)
                    : null,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                unidadeDeOrigemId: true,
                dataDeNascimento: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(
            usuario,
            { status: 201 }
        )

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error)

        return NextResponse.json(
            {
                erro: "Erro interno ao cadastrar usuário.",
            },
            {
                status: 500,
            }
        )
    }
}

export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany({
            include: {
                unidadeDeOrigem: true,
            },
            orderBy: {
                nome: "asc",
            },
        });

        return NextResponse.json(usuarios);

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao buscar usuários.",
            },
            {
                status: 500,
            }
        );
    }
}