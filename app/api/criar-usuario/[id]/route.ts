import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { TipoDeConta } from "@/generated/prisma/client"

type Contexto = {
    params: Promise<{ id: string }>
}

export async function PATCH(
    request: NextRequest,
    { params }: Contexto
) {
    try {
        // 1. Verifica autenticação e permissão
        const sessao = await auth()

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            )
        }

        // Ajuste o nome da propriedade conforme sua configuração do NextAuth.
        // if (sessao.user.tipoDeConta !== "SENIOR_ADMIN") {
        //     return NextResponse.json(
        //         { erro: "Você não tem permissão para atualizar usuários." },
        //         { status: 403 }
        //     )
        // }

        const { id } = await params

        // 2. Verifica se o usuário existe
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id },
        })

        if (!usuarioExistente) {
            return NextResponse.json(
                { erro: "Usuário não encontrado." },
                { status: 404 }
            )
        }

        // 3. Recebe os dados
        const dados = await request.json()

        const {
            nome,
            email,
            dataDeNascimento,
            senha,
            confirmarSenha,
            tipoDeConta,
            unidadeDeOrigem,
        } = dados

        if (
            !nome?.trim() ||
            !email?.trim() ||
            !senha ||
            !confirmarSenha ||
            !tipoDeConta
        ) {
            return NextResponse.json(
                { erro: "Preencha todos os campos obrigatórios." },
                { status: 400 }
            )
        }

        if (senha !== confirmarSenha) {
            return NextResponse.json(
                { erro: "As senhas não coincidem." },
                { status: 400 }
            )
        }

        if (senha.length < 8) {
            return NextResponse.json(
                { erro: "A senha deve ter pelo menos 8 caracteres." },
                { status: 400 }
            )
        }

        if (!Object.values(TipoDeConta).includes(tipoDeConta)) {
            return NextResponse.json(
                { erro: "Tipo de conta inválido." },
                { status: 400 }
            )
        }

        // 4. Verifica se o e-mail já pertence a outro usuário
        const emailExistente = await prisma.usuario.findUnique({
            where: { email: email.trim() },
        })

        if (emailExistente && emailExistente.id !== id) {
            return NextResponse.json(
                { erro: "Este e-mail já está cadastrado." },
                { status: 409 }
            )
        }

        // 5. Valida a data de nascimento
        let nascimento: Date | null = null

        if (dataDeNascimento) {
            nascimento = new Date(`${dataDeNascimento}T12:00:00`)

            if (Number.isNaN(nascimento.getTime())) {
                return NextResponse.json(
                    { erro: "Data de nascimento inválida." },
                    { status: 400 }
                )
            }
        }

        // 6. Gera o hash da nova senha
        const senhaHash = await hash(senha, 12)

        // 7. Atualiza o usuário
        const usuarioAtualizado = await prisma.usuario.update({
            where: { id },
            data: {
                nome: nome.trim(),
                email: email.trim(),
                dataDeNascimento: nascimento,
                senhaHash,
                tipoDeConta,
                localId: unidadeDeOrigem
                    ? Number(unidadeDeOrigem)
                    : null,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                dataDeNascimento: true,
                ativo: true,
                tipoDeConta: true,
                localId: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(usuarioAtualizado)

    } catch (erro) {
        console.error("Erro ao atualizar usuário:", erro)

        return NextResponse.json(
            { erro: "Não foi possível atualizar o usuário." },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: Contexto
) {
    try {
        const sessao = await auth()

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            )
        }

        // if (sessao.user.tipoDeConta !== "SENIOR_ADMIN") {
        //     return NextResponse.json(
        //         { erro: "Você não tem permissão para alterar usuários." },
        //         { status: 403 }
        //     )
        // }

        const { id } = await params
        const { ativo } = await request.json()

        if (typeof ativo !== "boolean") {
            return NextResponse.json(
                { erro: "Informe um status válido." },
                { status: 400 }
            )
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id },
        })

        if (!usuarioExistente) {
            return NextResponse.json(
                { erro: "Usuário não encontrado." },
                { status: 404 }
            )
        }

        const usuarioAtualizado = await prisma.usuario.update({
            where: { id },
            data: { ativo },
            select: {
                id: true,
                nome: true,
                email: true,
                ativo: true,
                tipoDeConta: true,
            },
        })

        return NextResponse.json(usuarioAtualizado)

    } catch (erro) {
        console.error("Erro ao alterar status:", erro)

        return NextResponse.json(
            { erro: "Não foi possível alterar o status do usuário." },
            { status: 500 }
        )
    }
}